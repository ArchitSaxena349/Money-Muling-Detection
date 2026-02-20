LaundroGraph 🕵️‍♂️💸

Financial Crime Detection Engine
A Graph-Based Money Laundering Detection System – Built for RIFT 2026

🚀 Overview

LaundroGraph is a powerful graph analytics engine that detects complex financial crime patterns like Smurfing, Cycles, Layered Shells, and High Velocity Transactions using advanced graph theory algorithms.

It transforms transaction datasets into dynamic network graphs and applies topology-based fraud detection models with precision scoring.

🏗 System Architecture
🔹 High-Level Architecture
CSV Upload → FastAPI Backend → Graph Construction (NetworkX) 
→ Fraud Detection Engine → Suspicion Scoring 
→ JSON Response → React + D3 Visualization
🔹 Components
1️⃣ Frontend (React + D3)

Upload CSV file

Trigger API call

Render graph visualization

Highlight suspicious nodes/edges

Display fraud type & score

2️⃣ Backend (FastAPI + NetworkX)

Parse transaction dataset (Pandas)

Build directed graph (NetworkX)

Execute detection algorithms

Compute suspicion score

Return structured fraud insights

3️⃣ Data Layer

CSV-based transaction ingestion

Format:

transaction_id, sender_id, receiver_id, amount, timestamp
🧠 Algorithm Approach

LaundroGraph uses graph topology-based detection methods.

1️⃣ Cycle Detection (Circular Laundering)

Goal: Detect loops (A → B → C → A)

Method Used:

NetworkX.simple_cycles()

Based on Johnson’s algorithm

Time Complexity:

O((V + E)(C + 1))
Where:

V = Nodes

E = Edges

C = Number of cycles

2️⃣ Smurfing Detection (Fan-in / Fan-out)

Pattern:
Multiple small transactions to one node OR from one node

Logic:

Degree centrality threshold

Amount threshold check

Temporal proximity validation

Time Complexity:

O(V + E)

3️⃣ Layered Shell Detection

Pattern:
Long low-activity chains (A → B → C → D → E)

Method:

DFS / BFS traversal

Detect long simple paths

Low average transaction amount

Time Complexity:

O(V + E)

4️⃣ High Velocity Transactions

Pattern:
Rapid successive transactions within short time window

Method:

Sort by timestamp

Sliding window analysis

Time Complexity:

O(N log N) (due to sorting)

🎯 Suspicion Score Methodology

Each detected entity receives a Suspicion Score.

🔹 Formula
Suspicion Score = Base Score + Pattern Modifiers + Risk Amplifiers
🔹 Base Scores
Fraud Type	Base Score
Cycle	50
Smurfing	40
Layered Shell	45
High Velocity	35
🔹 Modifiers

Large Total Amount → +10 to +25

Cross-pattern involvement → +20

Short Timeframe execution → +15

Multi-hop complexity → +10

🔹 Final Classification
Score Range	Risk Level
0–40	Low Risk
41–70	Medium
71–100	High Risk
🛠 Tech Stack
🔹 Backend

Python

FastAPI

NetworkX

Pandas

🔹 Frontend

React

TypeScript

Vite

D3.js

Tailwind CSS

⚙ Installation & Setup
1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Server runs at:

http://localhost:8000
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000
3️⃣ Usage Steps

Open browser → http://localhost:3000

Upload CSV transaction file

Click Analyze

View:

Suspicious Accounts

Fraud Type

Suspicion Score

Interactive Graph

⚠ Known Limitations

Works best with structured CSV input

Large graphs (>100k transactions) may slow cycle detection

False positives possible in high-volume legitimate systems

No real-time streaming support (batch processing only)

No ML-based anomaly detection (rule-based engine)

👥 Team Members

Archit Saxena
Anshika Daksh
Divyanshi Dubey
Divyansh Soni

Backend Development

Fraud Algorithm Design

Graph Analytics

(Add more team members here if applicable)

📂 Project Structure
/LaundroGraph
├── backend/
│   ├── main.py
│   ├── detection.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
💡 Future Improvements

Real-time transaction monitoring

ML-based anomaly detection

Database integration (PostgreSQL / Neo4j)

AI-powered fraud explanation engine

Dashboard analytics panel

Built with ❤️ for RIFT 2026 Hackathon
