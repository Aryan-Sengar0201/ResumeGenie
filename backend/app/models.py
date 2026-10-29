import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from .database import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)  # pdf, docx
    file_size_kb = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Candidate extracted basic facts
    candidate_name = Column(String(150), nullable=True)
    candidate_email = Column(String(150), nullable=True)
    candidate_phone = Column(String(50), nullable=True)
    
    # Overall scoring & target
    total_score = Column(Integer, nullable=False, default=0)
    target_role = Column(String(100), nullable=True)
    
    # JSON payload columns for rich structures
    scores_breakdown_json = Column(Text, nullable=False, default="{}")
    extracted_data_json = Column(Text, nullable=False, default="{}")
    analysis_findings_json = Column(Text, nullable=False, default="{}")
    career_matches_json = Column(Text, nullable=False, default="[]")
    suggestions_json = Column(Text, nullable=False, default="{}")
    ai_insights_json = Column(Text, nullable=False, default="{}")

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "file_type": self.file_type,
            "file_size_kb": self.file_size_kb,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "candidate_name": self.candidate_name,
            "candidate_email": self.candidate_email,
            "candidate_phone": self.candidate_phone,
            "total_score": self.total_score,
            "target_role": self.target_role,
            "scores_breakdown": json.loads(self.scores_breakdown_json or "{}"),
            "extracted_data": json.loads(self.extracted_data_json or "{}"),
            "analysis_findings": json.loads(self.analysis_findings_json or "{}"),
            "career_matches": json.loads(self.career_matches_json or "[]"),
            "suggestions": json.loads(self.suggestions_json or "{}"),
            "ai_insights": json.loads(self.ai_insights_json or "{}"),
        }
