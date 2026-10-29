import os
import uuid
import json
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db, init_db
from .models import ResumeAnalysis
from .schemas import (
    AnalysisResponse, HistoryItem, SkillGapAnalysisRequest,
    ScoreBreakdown, ExtractedResumeData, AnalysisFindings,
    CareerMatchItem, ImprovementSuggestions, AIInsights, ContactInfo, CategorizedSkills
)
from .services.parser import (
    extract_text_from_pdf, extract_text_from_docx,
    extract_contact_info, detect_sections
)
from .services.skills_extractor import extract_skills
from .services.scorer import calculate_heuristic_score
from .services.career_matcher import (
    match_all_careers, get_skill_gap_for_role, CAREER_ROLES
)
from .services.ai_service import generate_ai_insights
from .services.report_generator import generate_pdf_report

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="ResumeGenie — AI-Powered Resume Analyzer & Career Recommendation System API",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "gemini_model": settings.GEMINI_MODEL
    }

@app.get("/api/roles")
def get_available_roles():
    """Returns catalog of supported industry career benchmarks."""
    roles = []
    for title, data in CAREER_ROLES.items():
        roles.append({
            "title": title,
            "core_skills": data["core_skills"],
            "secondary_skills": data["secondary_skills"],
            "description": data["description"],
            "demand_level": data["demand_level"],
            "salary_range": data["salary_range"]
        })
    return roles

async def process_resume_bytes(
    file_bytes: bytes,
    filename: str,
    target_role: Optional[str],
    db: Session
) -> AnalysisResponse:
    """Core pipeline processing extracted resume bytes into verified analysis."""
    ext = Path(filename).suffix.lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. ResumeGenie only supports .pdf and .docx documents."
        )

    file_size_kb = round(len(file_bytes) / 1024, 2)
    if len(file_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum size limit of {settings.MAX_FILE_SIZE_BYTES // (1024*1024)}MB."
        )

    # 1. Text extraction
    if ext == ".pdf":
        raw_text, page_count = extract_text_from_pdf(file_bytes)
        file_type = "pdf"
    else:
        raw_text, page_count = extract_text_from_docx(file_bytes)
        file_type = "docx"

    # 2. Contact info & Sections detection
    contact_info = extract_contact_info(raw_text)
    sections_dict, detected_sections, missing_sections = detect_sections(raw_text)

    # 3. Skills extraction
    skills_by_cat, all_skills = extract_skills(raw_text)

    # 4. Heuristic scoring
    score_breakdown, findings, strengths, weaknesses = calculate_heuristic_score(
        text=raw_text,
        sections=sections_dict,
        contact_info=contact_info,
        skills_by_cat=skills_by_cat,
        all_skills=all_skills
    )

    total_score = score_breakdown["total_score"]

    # 5. Career Matching
    career_matches = match_all_careers(all_skills)
    top_career = career_matches[0]["role_title"] if career_matches else "Software Engineer"
    top_missing = career_matches[0]["priority_skills"] if career_matches else ["Cloud", "CI/CD"]

    # 6. AI Insights or Deterministic Fallback
    ai_insights = await generate_ai_insights(
        candidate_name=contact_info.get("name") or "Candidate",
        total_score=total_score,
        all_skills=all_skills,
        top_career=target_role or top_career,
        missing_skills=top_missing,
        weaknesses=weaknesses,
        resume_text_sample=raw_text
    )

    # 7. Suggestions Assembly
    suggestions = {
        "content_improvements": ai_insights.get("content_improvements", []),
        "project_recommendations": ai_insights.get("project_recommendations", []),
        "learning_roadmaps": ai_insights.get("learning_roadmaps", []),
        "quick_wins": ai_insights.get("quick_wins", [])
    }

    # Word stats
    words = raw_text.split()
    word_count = len(words)
    char_count = len(raw_text)
    est_read_time = max(15, round((word_count / 200) * 60))

    extracted_data_obj = {
        "contact_info": contact_info,
        "sections_detected": detected_sections,
        "missing_sections": missing_sections,
        "word_count": word_count,
        "char_count": char_count,
        "estimated_read_time_seconds": est_read_time,
        "skills_by_category": skills_by_cat,
        "all_skills": all_skills,
        "text_preview": raw_text[:600] + ("..." if len(raw_text) > 600 else "")
    }

    # 8. Save into SQLite
    analysis_id = str(uuid.uuid4())
    record = ResumeAnalysis(
        id=analysis_id,
        filename=filename,
        file_type=file_type,
        file_size_kb=file_size_kb,
        candidate_name=contact_info.get("name"),
        candidate_email=contact_info.get("email"),
        candidate_phone=contact_info.get("phone"),
        total_score=total_score,
        target_role=target_role,
        scores_breakdown_json=json.dumps(score_breakdown),
        extracted_data_json=json.dumps(extracted_data_obj),
        analysis_findings_json=json.dumps(findings),
        career_matches_json=json.dumps(career_matches),
        suggestions_json=json.dumps(suggestions),
        ai_insights_json=json.dumps(ai_insights)
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Return validated Pydantic model
    return AnalysisResponse(
        id=analysis_id,
        filename=filename,
        file_type=file_type,
        file_size_kb=file_size_kb,
        created_at=record.created_at.isoformat() if record.created_at else "",
        candidate_name=contact_info.get("name"),
        candidate_email=contact_info.get("email"),
        candidate_phone=contact_info.get("phone"),
        total_score=total_score,
        target_role=target_role,
        scores_breakdown=ScoreBreakdown(**score_breakdown),
        extracted_data=ExtractedResumeData(**extracted_data_obj),
        analysis_findings=AnalysisFindings(**findings),
        career_matches=[CareerMatchItem(**cm) for cm in career_matches],
        suggestions=ImprovementSuggestions(**suggestions),
        ai_insights=AIInsights(
            is_ai_generated=ai_insights.get("is_ai_generated", False),
            provider=ai_insights.get("provider", "Deterministic"),
            executive_summary=ai_insights.get("executive_summary", ""),
            bullet_rewrites=ai_insights.get("bullet_rewrites", []),
            interview_questions=ai_insights.get("interview_questions", []),
            custom_career_advice=ai_insights.get("custom_career_advice", "")
        )
    )

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Primary upload endpoint for PDF and DOCX files."""
    contents = await file.read()
    return await process_resume_bytes(
        file_bytes=contents,
        filename=file.filename or "resume.pdf",
        target_role=target_role,
        db=db
    )

@app.post("/api/sample/{sample_name}", response_model=AnalysisResponse)
async def analyze_sample_endpoint(
    sample_name: str,
    target_role: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Instant demonstration endpoint using pre-bundled sample resumes."""
    samples_dir = Path(__file__).resolve().parent / "sample_resumes"
    if sample_name.lower() in ["swe", "software_engineer", "fullstack"]:
        file_path = samples_dir / "sample_software_engineer.pdf"
        default_target = "Full Stack Developer"
    elif sample_name.lower() in ["data", "analyst", "data_analyst"]:
        file_path = samples_dir / "sample_data_analyst.docx"
        default_target = "Data Analyst"
    else:
        raise HTTPException(status_code=404, detail="Sample resume not found. Options: 'swe' or 'data'.")

    if not file_path.exists():
        # Auto-regenerate if missing
        from .services.create_samples import generate_sample_swe_pdf, generate_sample_data_docx
        generate_sample_swe_pdf()
        generate_sample_data_docx()

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    return await process_resume_bytes(
        file_bytes=file_bytes,
        filename=file_path.name,
        target_role=target_role or default_target,
        db=db
    )

@app.get("/api/analyses", response_model=List[HistoryItem])
def get_analysis_history(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieves recent analyses for the history tab."""
    records = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).limit(limit).all()
    history = []
    for r in records:
        career_matches = json.loads(r.career_matches_json or "[]")
        top_match = career_matches[0]["role_title"] if career_matches else None
        extracted = json.loads(r.extracted_data_json or "{}")
        all_skills_count = len(extracted.get("all_skills", []))

        history.append(HistoryItem(
            id=r.id,
            filename=r.filename,
            file_type=r.file_type,
            file_size_kb=r.file_size_kb,
            created_at=r.created_at.isoformat() if r.created_at else "",
            candidate_name=r.candidate_name,
            candidate_email=r.candidate_email,
            total_score=r.total_score,
            target_role=r.target_role,
            top_career_match=top_match,
            all_skills_count=all_skills_count
        ))
    return history

@app.get("/api/analyses/{analysis_id}")
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    """Retrieves complete analysis report by ID."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return record.to_dict()

@app.delete("/api/analyses/{analysis_id}")
def delete_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    """Deletes an analysis record from database."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Analysis {analysis_id} deleted."}

@app.post("/api/skill-gap")
def get_skill_gap_endpoint(req: SkillGapAnalysisRequest, db: Session = Depends(get_db)):
    """Calculates skill gap for a target role against current skills or an existing analysis."""
    candidate_skills = []
    if req.analysis_id:
        record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == req.analysis_id).first()
        if record:
            extracted = json.loads(record.extracted_data_json or "{}")
            candidate_skills = extracted.get("all_skills", [])

    if req.current_skills:
        candidate_skills = list(set(candidate_skills + req.current_skills))

    gap_data = get_skill_gap_for_role(req.role_title, candidate_skills)
    return gap_data

@app.get("/api/report/{analysis_id}/pdf")
def download_pdf_report(analysis_id: str, db: Session = Depends(get_db)):
    """Generates and downloads the executive PDF report."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    analysis_dict = record.to_dict()
    pdf_bytes = generate_pdf_report(analysis_dict)

    safe_name = (record.candidate_name or "Resume").replace(" ", "_")
    filename = f"ResumeGenie_Report_{safe_name}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
