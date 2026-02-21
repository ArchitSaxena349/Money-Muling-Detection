# 🕵️‍♂️ LaundroGraph
**Graph-Based Financial Crime Detection Engine**

Built for RIFT 2026

## 🔗 Live Links
- **Frontend Dashboard**: [money-muling-detection-three.vercel.app](https://money-muling-detection-three.vercel.app/)
- **Backend API**: [money-muling-detection-d3u9.vercel.app](https://money-muling-detection-d3u9.vercel.app/)
- **API Documentation**: [Swagger UI](https://money-muling-detection-d3u9.vercel.app/docs)

---

## 📌 Overview
LaundroGraph is a graph analytics–powered fraud detection engine designed to uncover complex money laundering patterns in transactional systems. 

Unlike traditional rule-based monitoring systems that focus on isolated transactions, LaundroGraph analyzes transaction topology to identify structured financial crime patterns.

### 🎯 Key Detections
- 🔁 **Circular Transactions**: Cycle-based laundering (e.g., A → B → C → A).
- 🔄 **Smurfing**: Fan-in / Fan-out structuring (structuring).
- 🏢 **Layered Shells**: Long chains of low-activity intermediary accounts.
- ⚡ **High-Velocity**: Rapid successive transfers within a short time window.

---

## 🏗 System Architecture
1. **CSV Upload**: Users upload transaction history.
2. **FastAPI Backend**: Processes data and constructs a directed graph using **NetworkX**.
3. **Detection Engine**: Applies graph-theoretic algorithms to find suspicious subgraphs.
4. **Scoring Engine**: Calculates risk scores (0-100) based on pattern complexity.
5. **Interactive Visualization**: React dashboard uses **D3.js** for real-time graph exploration.

---

## 🧠 Detection Logic
LaundroGraph uses classical graph algorithms combined with financial heuristics.

### 1. Cycle Detection
- **Algorithm**: Johnson’s Algorithm (`NetworkX.simple_cycles`)
- **Objective**: Detect circular fund flows.
- **Constraints**: Optimized for cycles of length 3-5 (PRD compliance).

### 2. Smurfing (Structuring)
- **Pattern**: Multiple small transactions converging to or dispersing from a single node.
- **Logic**: Degree centrality thresholds + 72h sliding window analysis.

### 3. Layered Shells
- **Pattern**: Long chains of low-activity accounts used to obscure origin.
- **Method**: DFS/BFS traversal identifying intermediate nodes with low out-degree.

---

## 🎯 Suspicion Scoring
| Fraud Type | Base Score | Modifiers |
| :--- | :--- | :--- |
| **Cycle** | 50 | Multi-pattern (+20) |
| **Smurfing** | 40 | High total amount (+25) |
| **Layered Shell** | 45 | Short timeframe (+15) |
| **High Velocity** | 35 | Multi-hop complexity (+10) |

**Risk Levels**:
- 🟢 **0 – 40**: Low Risk
- 🟡 **41 – 70**: Medium Risk
- 🔴 **71 – 100**: High Risk

---

## 🛠 Tech Stack
- **Backend**: Python, FastAPI, NetworkX, Pandas
- **Frontend**: React, TypeScript, Vite, D3.js, Tailwind CSS

---

## ⚙ Installation & Setup

### 1️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*API runs at `http://localhost:8000`*

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App runs at `http://localhost:3000`*

---

## 📂 Project Structure
```
/LaundroGraph
├── backend/            # FastAPI Server & Detection Logic
│   ├── main.py
│   ├── detection.py
│   └── requirements.txt
├── frontend/           # React Dashboard
│   ├── src/
│   │   ├── components/ # Visualization & UI
│   │   └── App.tsx     # Integration Logic
│   └── package.json
└── README.md
```

---

## 👥 Team: RIFT 2026
- **Archit Saxena** – Team Lead
- **Anshika Daksh**
- **Divyanshi Dubey**
- **Divyansh Soni**

---

## ⚠ Limitations & Roadmap
- **Scaling**: Large graphs (>100k txs) may require localized cycle detection.
- **Data**: Currently supports structured CSV; Neo4j integration is in the roadmap.
- **AI**: Future plans include LLM-based fraud explanation for flagged accounts.

---
*Built with ❤️ for RIFT 2026*
