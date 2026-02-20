🕵️‍♂️ LaundroGraph
Graph-Based Financial Crime Detection Engine

Built for RIFT 2026

🔗 Live Demo / Repository:
(https://money-muling-detection-three.vercel.app/)
📌 Overview

LaundroGraph is a graph analytics–powered fraud detection engine designed to uncover complex money laundering patterns in transactional systems.

Unlike traditional rule-based monitoring systems that focus on isolated transactions, LaundroGraph analyzes transaction topology to identify structured financial crime patterns.

🎯 Detects:

🔁 Circular Transactions (Cycle-based laundering)

🔄 Smurfing (Fan-in / Fan-out structuring)

🏢 Layered Shell Account Chains

⚡ High-Velocity Transfers

The system transforms transactional CSV datasets into directed graphs and applies graph-theoretic detection algorithms with precision-based suspicion scoring.

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

CSV Upload Interface

REST API Integration

Interactive Graph Visualization

Suspicious Node & Edge Highlighting

Fraud Type & Risk Score Display

2️⃣ Backend (FastAPI + NetworkX)

Transaction parsing using Pandas

Directed graph construction

Graph-based fraud detection algorithms

Suspicion scoring engine

REST API response system

3️⃣ Data Layer

Expected CSV Format:

transaction_id,sender_id,receiver_id,amount,timestamp
🧠 Detection Algorithms

LaundroGraph uses classical graph algorithms combined with financial heuristics.

🔁 1. Cycle Detection

Objective: Detect circular fund flows
Example: A → B → C → A

Algorithm Used:
NetworkX.simple_cycles() (Johnson’s Algorithm)

Time Complexity:

O((V + E)(C + 1))

Where:

V = Number of nodes

E = Number of edges

C = Number of cycles

🔄 2. Smurfing Detection (Structuring)

Pattern:
Multiple small transactions converging to or dispersing from a single node.

Logic:

Degree centrality threshold

Amount threshold validation

Time proximity clustering

Time Complexity:

O(V + E)
🏢 3. Layered Shell Account Detection

Pattern:
Long chains of low-activity intermediary accounts used to obscure origin.

Method:

DFS/BFS traversal

Long path detection

Low average transaction filter

Time Complexity:

O(V + E)
⚡ 4. High Velocity Transactions

Pattern:
Rapid successive transfers within a short time window.

Method:

Timestamp sorting

Sliding window time analysis

Time Complexity:

O(N log N)
🎯 Suspicion Scoring System

Each detected entity (node or subgraph) is assigned a Suspicion Score (0–100).

🔹 Formula
Suspicion Score = Base Score 
                + Pattern Modifiers 
                + Risk Amplifiers
🔹 Base Scores
Fraud Type	Base Score
Cycle	50
Smurfing	40
Layered Shell	45
High Velocity	35
🔹 Modifiers

Large total transaction amount → +10 to +25

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

Upload a transaction CSV file

Click Analyze

View:

Detected fraud rings

Suspicious accounts

Risk scores

Interactive transaction graph

⚠ Known Limitations

Supports structured CSV input only

Large graphs (>100k transactions) may slow cycle detection

Rule-based system (no ML anomaly detection yet)

Batch processing only (no real-time streaming)

Potential false positives in high-volume legitimate systems

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

Archit Saxena – Team Lead

Anshika Daksh

Divyanshi Dubey

Divyansh Soni

Contributions:

Backend Development

Graph Algorithm Design

Fraud Detection Engine

🌟 Future Roadmap

Real-time transaction monitoring

ML-based anomaly detection

Neo4j graph database integration

Risk intelligence dashboard

AI-powered fraud explanation engine
