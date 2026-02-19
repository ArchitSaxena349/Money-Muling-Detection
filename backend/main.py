from fastapi import FastAPI, UploadFile, File
import pandas as pd
import networkx as nx
import time
from detection import detect_suspicious_activity
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS middleware yaha hona chahiye (function ke bahar)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        start_time = time.time()

        # 1. Input Validation
        try:
            df = pd.read_csv(file.file)
        except Exception:
            return {"error": "Invalid CSV file"}

        required_columns = {"transaction_id", "sender_id", "receiver_id", "amount", "timestamp"}
        if not required_columns.issubset(df.columns):
            return {"error": f"Missing required columns: {required_columns - set(df.columns)}"}

        try:
            df["amount"] = pd.to_numeric(df["amount"])
            df["timestamp"] = pd.to_datetime(df["timestamp"])
        except Exception:
             return {"error": "Invalid data types for amount or timestamp"}

        # 2. Graph Construction
        G = nx.DiGraph()
        for _, row in df.iterrows():
            G.add_edge(row["sender_id"], row["receiver_id"], amount=row["amount"], timestamp=row["timestamp"])

        # 3. Detection
        suspicious_accounts, fraud_rings = detect_suspicious_activity(G, df)

        # 4. Sorting & Formatting
        suspicious_accounts = sorted(
            suspicious_accounts,
            key=lambda x: x["suspicion_score"],
            reverse=True
        )

        processing_time = round(time.time() - start_time, 3)

        summary = {
            "total_accounts_analyzed": G.number_of_nodes(),
            "suspicious_accounts_flagged": len(suspicious_accounts),
            "fraud_rings_detected": len(fraud_rings),
            "processing_time_seconds": processing_time
        }

        # Calculate degrees for nodes
        degrees = dict(G.degree())
        
        # Identify suspicious account IDs for easy lookup
        suspicious_ids = {acc["account_id"] for acc in suspicious_accounts}

        # Construct Nodes list with attributes
        nodes = []
        for n in G.nodes():
            nodes.append({
                "id": n,
                "degree": degrees.get(n, 0),
                "isSuspicious": n in suspicious_ids
            })

        # Construct Edges list with attributes
        edges = []
        for u, v, data in G.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "amount": data.get("amount", 0),
                "timestamp": str(data.get("timestamp", "")) 
            })

        # Convert DataFrame to list of dicts for transactions
        # Convert timestamp to string format for JSON serialization
        df["timestamp"] = df["timestamp"].astype(str)
        transactions = df.to_dict(orient="records")

        return {
            "transactions": transactions,
            "nodes": nodes,
            "edges": edges,
            "suspicious_accounts": suspicious_accounts,
            "fraud_rings": fraud_rings,
            "summary": summary
        }

    except Exception as e:
        return {"error": str(e)}
