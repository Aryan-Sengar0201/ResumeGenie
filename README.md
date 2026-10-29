# ResumeGenie 🧞‍♂️
> **AI-Powered Resume Analyzer, Heuristic Scorer & Career Recommendation System**  
> *A Complete College Mini Project built with Python, FastAPI, React, PyMuPDF, ReportLab & Google Gemini.*

---

## 🌟 Overview

**ResumeGenie** is a modern full-stack career platform designed to help college students and software job seekers critically audit their resumes, detect missing sections, identify technical and soft competencies, benchmark their tech stack against industry roles, and discover high-priority skill gaps.

Unlike generic tools that make deceptive claims about "cracking proprietary ATS filters," ResumeGenie uses a **transparent, documented 5-pillar heuristic scoring formula** combined with **Google Gemini AI** (or an intelligent, deterministic offline engine) to provide actionable, ethical career guidance.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 📄 **Dual-Format Parsing** | Extracts text and tables from text-based **PDF** (via `PyMuPDF`) and **DOCX** (via `python-docx`). Detects scanned or empty files gracefully. |
| 🔍 **Section & Contact Extraction** | Identifies candidate name, email, phone, LinkedIn, GitHub, and detects whether core sections (Education, Skills, Experience, Projects, Summary) are present. |
| 🧠 **Comprehensive Skills Taxonomy** | Recognizes 100+ skills grouped into 8 canonical categories: Languages, Frontend, Backend, Databases, Cloud/DevOps, AI/ML/Data, Tools, and Soft Skills. |
| 📊 **Transparent Heuristic Score (0-100)** | Fully documented 5-pillar breakdown (Section Completeness, Skills Depth, Impact Verbs, Formatting, Experience). Includes an explicit educational disclaimer. |
| 🎯 **Career Matching** | Benchmarks extracted skills against 10 industry roles (Full Stack, Frontend, Backend, Data Scientist, ML Engineer, DevOps, Mobile, Security, etc.) with weighted match percentages. |
| 🔬 **Skill-Gap Analysis & Simulation** | Displays side-by-side missing skills for target roles, ranks learning priorities, and simulates projected score boosts upon acquiring top missing competencies. |
| ✍️ **STAR-Method Bullet Transformations** | Converts passive duty statements into high-converting STAR bullet points with quantifiable performance metrics. |
| 🤖 **Gemini AI + Deterministic Fallback** | Integrates Google Gemini 1.5 Flash for personalized career advice and technical interview questions. Automatically falls back to a deterministic rule-based engine when no API key is provided. |
| 📑 **Downloadable Executive PDF Report** | Generates a clean, branded PDF summary containing candidate overview, scoring breakdown, skills matrix, career recommendations, and project roadmaps using `ReportLab`. |
| 🗄️ **Persistent Upload History** | Saves past analyses locally in SQLite so candidates can reload, review, or delete past audits. |
| ⚡ **1-Click Instant Demos** | Pre-bundled sample resumes (CS Software Engineer PDF & Data Analyst DOCX) allow immediate one-click testing without uploading external files. |
| 🌓 **Dark & Light Mode** | Responsive, accessible interface with persistent dark/light theme toggle. |

---

## 🏗️ Technology Stack

### Backend
- **Framework:** Python 3.11+, [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **PDF Extraction:** [PyMuPDF](https://pymupdf.readthedocs.io/) (`fitz`)
- **DOCX Extraction:** [python-docx](https://python-docx.readthedocs.io/)
- **PDF Report Generation:** [ReportLab](https://www.reportlab.com/)
- **Database:** SQLite via [SQLAlchemy](https://www.sqlalchemy.org/)
- **AI Integration:** Google Gemini API (`gemini-1.5-flash`) with resilient HTTP client (`httpx`)
- **Automated Testing:** [Pytest](https://docs.pytest.org/), [HTTPX TestClient](https://www.python-httpx.org/)

### Frontend
- **Framework:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visuals:** [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📐 Transparent Scoring Heuristic

ResumeGenie calculates a composite score from **0 to 100** based on 5 documented pillars:

```text
Total Heuristic Score (100 pts)
├── 1. Section Completeness (Max 25 pts)
│   ├── Contact details (email & phone): 5 pts
│   ├── Clickable profiles (LinkedIn / GitHub): 3 pts
│   ├── Education section: 5 pts
│   ├── Skills section: 5 pts
│   └── Experience / Projects sections: 7 pts
├── 2. Skills Depth & Diversity (Max 25 pts)
│   ├── Quantity of technical skills (>=12 skills: 15 pts, 8-11: 12 pts, 4-7: 8 pts)
│   ├── Category breadth across >=4 tech domains: 6 pts
│   └── Soft skills presence: 4 pts
├── 3. Action Verbs & Impact (Max 20 pts)
│   ├── Strong action verbs (Engineered, Architected, Optimized... >=8: 10 pts)
│   └── Quantified metrics (Percentages, user scale, latency savings... >=4: 10 pts)
├── 4. Formatting, Structure & Readability (Max 15 pts)
│   ├── Word count in optimal range (350 – 850 words): 6 pts
│   ├── Bullet points formatting: 5 pts
│   └── Section spacing and layout hygiene: 4 pts
└── 5. Experience & Projects Substance (Max 15 pts)
    ├── Experience narrative length (>=150 words: 10 pts)
    └── Technology integration within project narratives: 5 pts
```

> **Notice:** This score is an educational heuristic benchmark designed for self-improvement. It does not represent any commercial ATS filter and does not guarantee employment outcomes.

---

## 💻 Windows Setup & Run Guide

### Prerequisites
- Python 3.10+ (Verified on Python 3.11.9)
- Node.js 18+ (Verified on Node.js v24.20.0, npm 11.19.0)

---

### Step 1: Backend Setup

Open PowerShell in the `ResumeGenie/backend` directory:

```powershell
cd C:\Users\aryan\.gemini\antigravity\scratch\ResumeGenie\backend

# 1. Create a virtual environment (if not already created)
python -m venv venv

# 2. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables (Optional)
# Copy template and add your Gemini API key if you want AI-generated responses
Copy-Item .env.example .env
```

To configure Google Gemini API:
Edit `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=8000
HOST=127.0.0.1
```
*(If `GEMINI_API_KEY` is left blank, ResumeGenie seamlessly uses its high-accuracy deterministic heuristic engine. No key is required to test or demonstrate the app!)*

**Run Backend Server:**
```powershell
python run.py
```
Backend will start at: **`http://127.0.0.1:8000`**  
Interactive Swagger API docs: **`http://127.0.0.1:8000/docs`**

---

### Step 2: Frontend Setup

Open a second PowerShell terminal in `ResumeGenie/frontend`:

```powershell
cd C:\Users\aryan\.gemini\antigravity\scratch\ResumeGenie\frontend

# 1. Install frontend packages
npm install

# 2. Start the Vite development server
npm run dev
```
Frontend will start at: **`http://localhost:5173`**  
*(Vite proxies `/api` calls directly to `http://localhost:8000`)*

---

## 🧪 Running Automated Tests

### Backend Tests (Pytest)
From `ResumeGenie/backend`:
```powershell
.\venv\Scripts\pytest.exe -v
```
**Test Coverage Includes:**
- `test_parser.py`: PDF extraction, DOCX table extraction, contact regex, and section detection.
- `test_skills.py`: Technical/soft skills extraction and word boundary edge cases.
- `test_scorer.py`: 5-pillar scoring math, metric patterns, and transparent disclaimer validation.
- `test_career_matcher.py`: Role matching percentages and skill-gap simulations.
- `test_api.py`: FastAPI endpoints, sample PDF/DOCX flows, report PDF generation, and SQLite history operations.

### Frontend Build Test
From `ResumeGenie/frontend`:
```powershell
npm run build
```
Ensures strict TypeScript compilation (`tsc -b`) and bundle building without errors.

---

## 📁 Project Directory Structure

```text
ResumeGenie/
├── backend/
│   ├── app/
│   │   ├── config.py                 # App settings & Gemini configuration
│   │   ├── database.py               # SQLite connection & session management
│   │   ├── models.py                 # SQLAlchemy ResumeAnalysis model
│   │   ├── schemas.py                # Pydantic schemas for API inputs/outputs
│   │   ├── main.py                   # FastAPI routes & business logic
│   │   ├── sample_resumes/           # Built-in test PDF & DOCX resumes
│   │   └── services/
│   │       ├── parser.py             # PyMuPDF & python-docx text extractor
│   │       ├── skills_extractor.py   # Comprehensive canonical skill taxonomy
│   │       ├── scorer.py             # 5-pillar transparent heuristic scorer
│   │       ├── career_matcher.py     # 10 role benchmarks & skill gap math
│   │       ├── ai_service.py         # Google Gemini integration
│   │       ├── fallback_service.py   # Deterministic STAR & interview engine
│   │       ├── report_generator.py   # ReportLab executive PDF builder
│   │       └── create_samples.py     # Test resume generator
│   ├── tests/                        # 16 automated Pytest tests
│   ├── requirements.txt              # Pinned backend dependencies
│   ├── .env.example                  # Environment configuration template
│   └── run.py                        # Uvicorn startup script
├── frontend/
│   ├── src/
│   │   ├── components/               # ScoreGauge, SkillsMatrix, Uploader, etc.
│   │   ├── context/                  # ThemeContext (Dark/Light mode)
│   │   ├── pages/                    # Landing, Analyzer, Explorer, History
│   │   ├── services/api.ts           # Clean typed API client
│   │   ├── types/index.ts            # TypeScript interfaces
│   │   ├── App.tsx                   # Main component & tab navigation
│   │   └── index.css                 # Tailwind CSS & custom styling
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── README.md
└── .gitignore
```

---

## 🛡️ Reliability & Security Highlights

1. **No Frontend API Exposure:** Gemini API keys are strictly kept on the backend in `.env` and never leaked to the browser.
2. **Deterministic Fallback:** If the Gemini API is unreachable, rate-limited, or unconfigured, the application falls back automatically to the rule-based engine.
3. **Scanned PDF Handling:** If an uploaded PDF contains little or no extractable text (<40 chars), an informative 422 error is returned advising the user.
4. **Local SQLite Storage:** No external cloud database required; all upload history is persisted locally in `backend/resumegenie.db`.

---

## 🎓 Academic Demonstration Tips

1. Open **`http://localhost:5173`** in your browser.
2. Click **"Analyze Resume"** or **"Try Sample CS Resume"** to demonstrate instant PDF analysis.
3. Show the **Heuristic Score Gauge** and explain the **5 documented pillars**.
4. Show the **Extracted Competencies Matrix** with categorized badges.
5. Demonstrate the **Action Verbs & Impact Metrics** section.
6. Open **"View Full Skill-Gap Analysis"** on any career role to demonstrate the **projected score boost simulation**.
7. Click **"Download Verified PDF Report"** to show the generated executive ReportLab document.
8. Switch to **Upload History** to demonstrate SQLite persistence and past report retrieval.
