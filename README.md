# LaundroGraph 🕵️‍♂️💸

**Financial Crime Detection Engine**

A powerful graph-based fraud detection system designed to identify complex money laundering patterns like Smurfing, Cycles, and Layered Shells in transaction networks. Built for the RIFT 2026 Hackathon.

## 🚀 Key Features

-   **Advanced Detection Engine**: Identifies specific fraud topologies:
    -   **Cycles**: Circular flow of funds (e.g., A -> B -> C -> A).
    -   **Smurfing**: Fan-out / Fan-in patterns (structuring).
    -   **Layered Shells**: Long chains of low-activity accounts.
    -   **High Velocity**: Rapid transaction sequences.
-   **Precision Scoring**: Strict suspicion scoring formula (Base + Modifiers).
-   **Interactive Visualization**: D3.js powered graph network.
-   **Modern UI**: Premium dark-themed dashboard with glassmorphism.
-   **Deploy Ready**: Dockerized backend and frontend structure.

## 🛠 Tech Stack

-   **Backend**: Python, FastAPI, NetworkX, Pandas
-   **Frontend**: React, TypeScript, Vite, D3.js, Tailwind CSS
-   **Analysis**: Graph Theory, Cycle Basis Algorithms

## 📂 Project Structure

```
/LaundroGraph
├── backend/            # Python FastAPI Server
│   ├── main.py         # API Endpoints
│   ├── detection.py    # Core Fraud Algorithms
│   └── requirements.txt
├── frontend/           # React Application
│   ├── src/            # UI Components & Logic
│   └── package.json
└── README.md
```

## ⚡ Quick Start

### 1. Start the Backend Server
Navigate to the `backend` directory and run the FastAPI server:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend Application
Open a new terminal, navigate to `frontend`, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
1.  Open your browser at `http://localhost:3000`.
2.  Upload a CSV file containing transactions (Format: `transaction_id, sender_id, receiver_id, amount, timestamp`).
3.  The engine will automatically analyze the graph and visualize detected fraud rings.

---
*Built with ❤️ by Archit Saxena for RIFT 2026*
