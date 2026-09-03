# 🧾 Finance Wizard — AI Finance Controller

<div align="center">

**Razorpay AI Buildathon · Track 04 — AI Finance Controller**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/Database-SQLite_AES--256-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org)
[![Groq](https://img.shields.io/badge/AI-Groq_LLM-F55036?style=for-the-badge)](https://groq.com)

> **Transform 2–5 days of manual reconciliation into a sub-30 minute automated audit cycle.**

[🎬 YouTube Demo](https://youtu.be/XnVxCykOP3M) · [📸 Screenshots](#-screenshots) · [🚀 Quick Start](#-quick-start) · [🏗️ Architecture](#-architecture) · [🧩 10-Phase Pipeline](#-10-phase-pipeline)

</div>

---

## 🎬 Demonstration Video

<div align="center">

[![Watch Finance Wizard Demo on YouTube](https://img.youtube.com/vi/XnVxCykOP3M/maxresdefault.jpg)](https://youtu.be/XnVxCykOP3M)

<br/>

[![Watch on YouTube](https://img.shields.io/badge/▶️_Watch_Full_Demo_on_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/XnVxCykOP3M)

<p align="center">
  <sub>👆 Click the thumbnail above or <a href="https://youtu.be/XnVxCykOP3M">watch the full walkthrough on YouTube (https://youtu.be/XnVxCykOP3M)</a></sub>
</p>

</div>

---

## 📸 Screenshots

### 1. Upload & Start
Upload the three required CSV feeds (Settlement, Bank Statement, Ledger) or load the 74-record demo batch.
![Upload Page](docs/screenshots/upload.png)

### 2. Dashboard — Overview & KPIs
Real-time match rate, auto-approved settlements, held records, and escalation triage.
![Dashboard Overview](docs/screenshots/dashboard.png)

### 3. Transaction Audit Trail
Granular record-level table with MDR, GST on MDR, TDS (Sec. 194-O), effective bank credit, and auto-generated explainers.
![Transactions](docs/screenshots/transactions.png)

### 4. AI Finance Controller Reports & Forecasting
4-Pass matching tier distribution, statutory fee waterfalls, merchant analysis, and 25-day liquidity trajectory.
![Reports](docs/screenshots/reports.png)

### 5. Cash Position & Simulator
Realised cash, pending at risk, optimistic/pessimistic counterfactual liquidity simulator.
![Cash Position](docs/screenshots/cash.png)

### 6. Finance Agent (NL Query Copilot)
Natural language queries to chat with your financial data, backed by Groq LLM.
![Finance Agent](docs/screenshots/finance_agent.png)

### 7. Financial Memory & Historical Audit Search
Date-range filtering, audit trail inspection, and one-click RFC 4180 CSV export.
![Financial Memory](docs/screenshots/memory.png)

### 8. Institutional Rules & Guide
4-Pass matching cascade reference, statutory fee formula guidelines, and institutional memory rules.
![Guide](docs/screenshots/guide.png)

### 9. Settings & Governance
Configurable statutory fee rates (MDR, GST, TDS), matching tolerances, and developer connect.
![Settings](docs/screenshots/settings.png)

---

## 📌 Problem Statement

Finance teams at Razorpay merchant businesses lose **2–5 days every month** reconciling three disconnected sources of truth:

| Source | Problem |
|---|---|
| **Razorpay Settlement Reports** | Single lumped T+2 credit covers hundreds of orders; no per-order breakdown |
| **Bank Statements** | UTR references aggregate batches, not individual order IDs |
| **Internal Ledgers** | MDR, GST (18%), TDS (Sec. 194-O @ 1%) are not automatically reconciled |

Existing tools show *that* numbers differ — they do not explain *why*.

---

## ✅ Solution

**Finance Wizard** is a full-stack AI-powered reconciliation engine that:

- 🔀 **Decomposes** lumped T+2 settlements to the individual order level
- 🧮 **Auto-computes** MDR, GST on MDR, and TDS per order
- 🔍 **Classifies** every mismatch using an 11-priority deterministic rule engine
- 🤖 **Auto-investigates** escalated exceptions using a Groq LLM agent
- 💬 **Explains** each result in plain English
- 📊 **Forecasts** 25-day liquidity inflow from actual settlement dates
- 🧠 **Remembers** institutional rules across reconciliation cycles

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[👤 Finance Team] -->|Upload CSV files| B[React Frontend\nPort 3000]
    B -->|POST /api/upload| C[FastAPI Backend\nPort 8000]

    subgraph Phase1[Phase 1 · Ingest & Normalise]
        C --> D[Flexible Header Resolver\n40+ column aliases]
        D --> E[Auto-fee Calculator\nMDR · GST · TDS]
        E --> F[(SQLite DB\nAES-256-GCM Encrypted)]
    end

    subgraph Phase2[Phase 2 · 4-Pass Matching Engine]
        F --> G[Pass 1: Direct Exact Join 1:1]
        G --> H[Pass 2: Lumped Batch N:1]
        H --> I[Pass 3: Split Tranche 1:N]
        I --> J[Pass 4: Fuzzy Tolerance ±₹5 ±3days]
    end

    subgraph Phase3[Phase 3 · 11-Priority Classifier]
        J --> K{Decision Engine}
        K -->|APPROVE| L[✅ Auto-cleared]
        K -->|HOLD| M[⏸ Needs Review]
        K -->|ESCALATE| N[🔴 AI Investigation]
    end

    subgraph Phase4[Phase 4 · AI Agent Layer]
        N --> O[Groq LLM Agent\nLlama 3]
        O --> P[Auto-investigation Report\n+ Reasoning Log]
    end

    subgraph Phase5[Phase 5-10 · Dashboard & Insights]
        L & M & P --> Q[Finance Dashboard]
        Q --> R[📊 Reports & Charts]
        Q --> S[💰 Cash Position Engine]
        Q --> T[💬 Finance Agent NL Chat]
        Q --> U[📚 Financial Memory Rules]
        Q --> V[🔍 Historical Audit Search]
    end
```

---

## 🧩 10-Phase Pipeline

| Phase | Name | What it does |
|---|---|---|
| **1** | Ingest & Normalise | Accepts any CSV format, resolves 40+ column aliases, auto-computes MDR/GST/TDS |
| **2** | 4-Pass Matching | Decomposes lumped T+2 settlements — Direct, Lumped (N:1), Split (1:N), Fuzzy |
| **3** | 11-Priority Classifier | Labels every mismatch with a category and APPROVE / HOLD / ESCALATE decision |
| **4** | AI Auto-Investigation | Groq LLM agent investigates all ESCALATE records automatically |
| **5** | Fee & Tax Explainer | Plain-English breakdown of Gross → MDR → GST → TDS → Net per order |
| **6** | Financial Memory | Persistent institutional rule store shown in the Guide tab |
| **7** | Cash Forecaster | Real-time waterfall + 25-day liquidity trajectory from actual settlement dates |
| **8** | Finance Agent | Natural language chat interface for querying your reconciliation dataset |
| **9** | Configurable Rates | MDR, GST, TDS, rounding and date-tolerance rates changeable from Settings |
| **10** | Historical Audit | Date-range search + RFC 4180 CSV export of any past batch |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Python | ≥ 3.11 |
| pip / venv | latest |

### 1. Clone the repository

```bash
git clone https://github.com/Madankk-06/Finance-Wizard.git
cd Finance-Wizard
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Mac/Linux
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# → Edit .env and add your GROQ_API_KEY
```

### 3. Frontend Setup

```bash
# From project root
npm install
```

### 4. Start Both Servers (one command)

```bash
npm run dev
```

This starts:
- 🖥️ **Frontend** → `http://localhost:3000`
- ⚙️ **Backend API** → `http://localhost:8000`
- 📖 **API Docs** → `http://localhost:8000/docs`

---

## 🔑 Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Required — Get a free key at https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Optional — Defaults shown
DB_PATH=recon.db
SAMPLES_DIR=../data/samples
```

> ⚠️ **Never commit `.env` to Git.** The `.gitignore` already excludes it.

---

## 📁 Project Structure

```
finance-wizard/
├── backend/
│   ├── engine/
│   │   ├── matcher.py          # Pass matching algorithm
│   │   ├── classifier.py       # Priority classification engine
│   │   ├── investigator.py     # AI auto-investigation agent
│   │   ├── explainer.py        # Plain-language explanation generator
│   │   ├── cash_simulator.py   # Cash waterfall & forecasting
│   │   ├── memory.py           # Financial memory rules store
│   │   ├── nl_agent.py         # Natural language Finance Agent
│   │   └── groq_client.py      # Groq LLM API client
│   ├── routers/
│   │   ├── ingest.py           # CSV upload & normalisation
│   │   ├── reconcile.py        # Matching & reconciliation
│   │   ├── classify.py         # Classification & transactions API
│   │   ├── cash.py             # Cash position & forecasting
│   │   ├── memory.py           # Memory rules API
│   │   └── ask.py              # NL query endpoint
│   ├── config.py               # Settings & environment
│   ├── database.py             # SQLite + AES-256-GCM encryption layer
│   ├── main.py                 # FastAPI app entry point
│   └── requirements.txt
│
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation
│   │   ├── FileUploadCard.jsx  # CSV drag-and-drop upload
│   │   ├── HeaderChrome.jsx    # Top bar + export
│   │   └── AuthorConnectCard.jsx
│   ├── context/
│   │   └── ReconContext.jsx    # Global state & API orchestration
│   ├── pages/
│   │   ├── UploadPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── CashPage.jsx
│   │   ├── FinanceAgentPage.jsx
│   │   ├── MemoryPage.jsx
│   │   ├── GuidePage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/
│   │   └── api.js              # Backend API client
│   └── App.jsx
│
├── docs/
│   ├── screenshots/            # UI Screenshots
│   └── youtube_thumbnail.jpg   # YouTube Banner
├── data/
│   └── samples/                # Demo CSVs (settlement, bank, ledger)
├── package.json
└── vite.config.js
```

---

## 🛡️ Security

| Layer | Mechanism |
|---|---|
| Data at rest | AES-256-GCM field-level encryption on all PII |
| API keys | Server-side `.env` only — never exposed to frontend |
| UI | No cipher names, model names, or DB paths in the UI |
| Audit trail | Immutable append-only log of every system event |

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Vite 5 | Build tool & dev server |
| Lucide React | Icon library |
| Custom CSS Variables | Light / Dark theme system |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| uvicorn | ASGI server |
| pandas | CSV parsing & normalisation |
| SQLite + AES-256-GCM | Encrypted persistent storage |
| Groq API (Llama 3) | LLM auto-investigation & NL queries |
| python-cryptography | Field-level encryption |

---

## 📊 Performance

| Metric | Result |
|---|---|
| Reconciliation time (74 records) | < 0.25 s |
| Auto-approval rate | ~85% |
| Records reaching human review | < 15% |
| Supported dataset size | Up to 2,000 records per batch |

---

## 🤝 Connect with the Author

<div align="center">

### MADAN KK
**Developer & Creator · AI Finance Controller**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/madankk04122004/)
[![GitHub](https://img.shields.io/badge/GitHub-24292e?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Madankk-06)
[![Gmail](https://img.shields.io/badge/Gmail-DD4B39?style=for-the-badge&logo=gmail&logoColor=white)](mailto:madankk2004@gmail.com)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/__.madan___?igsh=NThiOGZvMndlZG9x)
[![Portfolio](https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://madan-portfolio-orcin.vercel.app/)

</div>

---

## 📄 License

Built for the **Razorpay AI Buildathon 2026 — Track 04: AI Finance Controller**.

---

<div align="center">
  <sub>Built with ❤️ for Razorpay AI Buildathon · Track 04</sub>
</div>
