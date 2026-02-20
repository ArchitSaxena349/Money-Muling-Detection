🕵️‍♂️ LaundroGraph
Financial Crime Detection Engine

A Graph-Based Money Laundering Detection System – Built for RIFT 2026

Live Demo URL:- https://github.com/ArchitSaxena349/Money-Muling-Detection

📌 Overview

LaundroGraph is a graph analytics-powered fraud detection engine designed to identify complex money laundering patterns such as:

🔁 Cycles (Circular Transactions)

🔄 Smurfing (Fan-in / Fan-out Structuring)

🏢 Layered Shell Accounts

⚡ High Velocity Transfers

The system transforms transaction datasets into directed graphs and applies topology-based detection algorithms with precision-based suspicion scoring.

🏗 System Architecture
🔹 High-Level Flow
CSV Upload
   ↓
FastAPI Backend
   ↓
Graph Construction (NetworkX)
   ↓
Fraud Detection Engine
   ↓
Suspicion Scoring
   ↓
JSON API Response
   ↓
React + D3 Visualization
🔹 Architecture Components
1️⃣ Frontend (React + D3.js)

CSV upload interface

API integration

Interactive graph visualization

Highlight suspicious nodes & edges

Display fraud type and risk score

2️⃣ Backend (FastAPI + NetworkX)

Transaction parsing using Pandas

Directed graph creation

Fraud pattern detection

Suspicion scoring engine

REST API response

3️⃣ Data Layer

Input CSV format:

transaction_id, sender_id, receiver_id, amount, timestamp
🧠 Algorithm Approach

LaundroGraph uses graph theory algorithms for pattern detection.

🔁 1. Cycle Detection

Objective: Detect circular fund flows (A → B → C → A)

Algorithm Used:

NetworkX.simple_cycles()

Based on Johnson’s Algorithm

Time Complexity:

O((V + E)(C + 1))

Where:

V = Number of nodes

E = Number of edges

C = Number of cycles

🔄 2. Smurfing Detection

Pattern: Multiple small transactions to/from a single node.

Logic:

Degree centrality threshold

Amount threshold validation

Time proximity check

Time Complexity:

O(V + E)
🏢 3. Layered Shell Detection

Pattern: Long chains of low-activity accounts.

Method:

DFS / BFS traversal

Long path detection

Low average transaction filter

Time Complexity:

O(V + E)
⚡ 4. High Velocity Transactions

Pattern: Rapid successive transfers within short time window.

Method:

Timestamp sorting

Sliding window analysis

Time Complexity:

O(N log N)
🎯 Suspicion Score Methodology

Each detected entity is assigned a Suspicion Score.

🔹 Formula
Suspicion Score = Base Score + Pattern Modifiers + Risk Amplifiers
🔹 Base Scores
Fraud Type	Base Score
Cycle	50
Smurfing	40
Layered Shell	45
High Velocity	35
🔹 Modifiers

Large total amount → +10 to +25

Multi-pattern involvement → +20

Short execution timeframe → +15

Multi-hop complexity → +10

🔹 Risk Classification
Score Range	Risk Level
0 – 40	Low Risk
41 – 70	Medium Risk
71 – 100	High Risk
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

Backend runs at:

http://localhost:8000
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000
🚀 Usage

Open http://localhost:3000

Upload transaction CSV file

Click Analyze

View:

Detected fraud rings

Suspicious accounts

Risk scores

Interactive network graph

⚠ Known Limitations

Optimized for structured CSV input only

Large graphs (>100k transactions) may slow cycle detection

Rule-based system (no ML anomaly detection)

Batch processing only (no real-time streaming support)

Possible false positives in high-volume legitimate systems

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
👥 Team

1.Archit Saxena
2.Anshika Daksh
3.Divyanshi Dubey
4.Divyansh Soni

Backend Development

Graph Algorithm Design

Fraud Detection Engine

🌟 Future Improvements

Real-time transaction monitoring

ML-based anomaly detection

Neo4j graph database integration

Risk dashboard analytics

AI-powered fraud explanation engine
