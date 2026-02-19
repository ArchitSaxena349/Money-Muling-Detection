import networkx as nx
import pandas as pd

def detect_suspicious_activity(G: nx.DiGraph, df):
    account_map = {}
    fraud_rings = []
    ring_id_counter = 1

    # Initialize account map helper
    def get_account_entry(acc_id):
        if acc_id not in account_map:
            account_map[acc_id] = {
                "account_id": acc_id,
                "detected_patterns": set(),
                "ring_id": None,
                "high_velocity": False
            }
        return account_map[acc_id]

    # --------------------
    # 0️⃣ High Velocity Detection (Modifier: +10)
    # --------------------
    # Check for accounts with many transactions in any 24h window
    # Threshold: Let's assume > 20 transactions in 24h is "high velocity"
    
    # We need to check per account (sender or receiver)
    all_accounts = set(df["sender_id"]).union(set(df["receiver_id"]))
    
    for acc in all_accounts:
        # Get all tx involving this account
        acc_txs = df[(df["sender_id"] == acc) | (df["receiver_id"] == acc)].sort_values("timestamp")
        if len(acc_txs) < 20:
            continue
            
        # Sliding window check
        is_high_velocity = False
        for i in range(len(acc_txs)):
            window_start = acc_txs.iloc[i]["timestamp"]
            window_end = window_start + pd.Timedelta(hours=24)
            count = 0
            for j in range(i, len(acc_txs)):
                if acc_txs.iloc[j]["timestamp"] > window_end:
                    break
                count += 1
            
            if count > 20: # Threshold for high velocity
                is_high_velocity = True
                break
        
        if is_high_velocity:
            entry = get_account_entry(acc)
            entry["high_velocity"] = True

    # --------------------
    # 1️⃣ Cycle Detection (3–5) -> Base Score 40
    # --------------------
    try:
        raw_cycles = list(nx.simple_cycles(G))
        unique_cycles = set()
        
        for cycle in raw_cycles:
            if 3 <= len(cycle) <= 5:
                # Canonical ordering to remove duplicates (e.g., A-B-C vs B-C-A)
                # Rotate cycle so smallest node is first
                min_node = min(cycle)
                min_idx = cycle.index(min_node)
                canonical_cycle = tuple(cycle[min_idx:] + cycle[:min_idx])
                
                if canonical_cycle in unique_cycles:
                    continue
                unique_cycles.add(canonical_cycle)

                ring_id = f"RING_{ring_id_counter:03d}"
                ring_id_counter += 1

                fraud_rings.append({
                    "ring_id": ring_id,
                    "member_accounts": list(canonical_cycle),
                    "pattern_type": "cycle",
                    "risk_score": 90.0 # High risk for cycles
                })

                for acc in cycle:
                    entry = get_account_entry(acc)
                    entry["detected_patterns"].add(f"cycle_length_{len(cycle)}")
                    entry["ring_id"] = ring_id

    except Exception as e:
        print(f"Cycle detection error: {e}")

    # --------------------
    # 2️⃣ Smurfing Detection (Fan-in / Fan-out) -> Base Score 35
    # --------------------
    # Fan-out: 1 sender -> 10+ receivers (72h)
    for sender, group in df.groupby("sender_id"):
        if len(group) < 10:
            continue
        group = group.sort_values("timestamp")
        
        # Check 72h window
        for i in range(len(group)):
            window_start = group.iloc[i]["timestamp"]
            window_end = window_start + pd.Timedelta(hours=72)
            
            # Get unique receivers in this window
            window_txs = group[(group["timestamp"] >= window_start) & (group["timestamp"] <= window_end)]
            unique_receivers = window_txs["receiver_id"].nunique()
            
            if unique_receivers >= 10:
                entry = get_account_entry(sender)
                entry["detected_patterns"].add("smurfing_fan_out")
                break # Detected for this user

    # Fan-in: 10+ senders -> 1 receiver (72h)
    for receiver, group in df.groupby("receiver_id"):
        if len(group) < 10:
            continue
        group = group.sort_values("timestamp")
        
        for i in range(len(group)):
            window_start = group.iloc[i]["timestamp"]
            window_end = window_start + pd.Timedelta(hours=72)
            
            window_txs = group[(group["timestamp"] >= window_start) & (group["timestamp"] <= window_end)]
            unique_senders = window_txs["sender_id"].nunique()
            
            if unique_senders >= 10:
                entry = get_account_entry(receiver)
                entry["detected_patterns"].add("smurfing_fan_in")
                break

    # --------------------
    # 3️⃣ Layered Shell Detection -> Base Score 30
    # --------------------
    # Chains of 3+ hops where intermediate nodes have degree <= 3
    # BFS/DFS approach
    
    # Pre-calculate degrees
    node_degrees = dict(G.degree())
    
    # Identify potential low-activity intermediate nodes
    low_activity_nodes = {n for n, d in node_degrees.items() if d <= 3}
    
    # Find paths
    # Optimization: Filter G to only include edges connected to at least one low_activity_node?
    # Or just iterate over nodes.
    
    for source in G.nodes():
        # Start BFS
        queue = [(source, [source])]
        visited = {source}
        
        while queue:
            curr, path = queue.pop(0)
            
            if len(path) > 5: # Limit depth
                continue
                
            if len(path) >= 4: # 3 hops = 4 nodes (A->B->C->D)
                # Check intermediate nodes (B, C)
                intermediates = path[1:-1]
                if all(node_degrees.get(n, 0) <= 3 for n in intermediates):
                    # Found layered shell
                    for n in intermediates:
                        entry = get_account_entry(n)
                        entry["detected_patterns"].add("layered_shell")
            
            if len(path) < 5:
                for neighbor in G.neighbors(curr):
                    if neighbor not in path: # Avoid immediate loops in path
                        queue.append((neighbor, path + [neighbor]))

    # --------------------
    # 4️⃣ Scoring Engine
    # --------------------
    suspicious_accounts = []
    
    for acc_id, data in account_map.items():
        if not data["detected_patterns"]:
            continue
            
        score = 0
        patterns = data["detected_patterns"]
        
        # Base Scores
        if any("cycle" in p for p in patterns):
            score += 40
        if any("smurfing" in p for p in patterns):
            score += 35
        if "layered_shell" in patterns:
            score += 30
            
        # Modifiers
        if len(patterns) > 1:
            score += 10 # Multi-pattern overlap
            
        if data["high_velocity"]:
            score += 10
            data["detected_patterns"].add("high_velocity") # Add to list for output
            
        # Cap at 100
        score = min(score, 100.0)
        
        suspicious_accounts.append({
            "account_id": acc_id,
            "suspicion_score": score,
            "detected_patterns": list(patterns),
            "ring_id": data["ring_id"]
        })

    return suspicious_accounts, fraud_rings
