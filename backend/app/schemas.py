from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class ScoreCategory(BaseModel):
    name: str
    score: int
    max_score: int
    feedback: str

class ScoreBreakdown(BaseModel):
    total_score: int
    max_score: int = 100
    section_completeness: ScoreCategory
    skills_depth: ScoreCategory
    action_verbs_impact: ScoreCategory
    readability_structure: ScoreCategory
    experience_projects: ScoreCategory
    disclaimer: str = (
        "Transparent Heuristic Score: For educational and guidance purposes. "
        "This score is calculated using transparent rule-based heuristics and is NOT "
        "an official ATS score or a guarantee of hiring outcomes."
    )

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

class CategorizedSkills(BaseModel):
    programming_languages: List[str] = []
    frontend: List[str] = []
    backend: List[str] = []
    databases: List[str] = []
    cloud_devops: List[str] = []
    ai_ml_data: List[str] = []
    tools_frameworks: List[str] = []
    soft_skills: List[str] = []

class ExtractedResumeData(BaseModel):
    contact_info: ContactInfo
    sections_detected: List[str]
    missing_sections: List[str]
    word_count: int
    char_count: int
    estimated_read_time_seconds: int
    skills_by_category: CategorizedSkills
    all_skills: List[str]
    text_preview: str

class AnalysisFindings(BaseModel):
    action_verbs_count: int
    action_verbs_found: List[str]
    quantified_metrics_count: int
    quantified_snippets: List[str]
    has_bullet_points: bool
    readability_rating: str  # e.g. "Excellent", "Good", "Needs Improvement"
    strengths: List[str]
    weaknesses: List[str]

class CareerMatchItem(BaseModel):
    role_title: str
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    priority_skills: List[str]
    rationale: str
    demand_level: str  # High, Very High, Steady
    average_salary_range: str

class SkillGapAnalysisRequest(BaseModel):
    analysis_id: Optional[str] = None
    role_title: str
    current_skills: Optional[List[str]] = None

class ProjectRecommendation(BaseModel):
    title: str
    description: str
    skills_covered: List[str]
    difficulty: str  # Beginner, Intermediate, Advanced

class BulletRewrite(BaseModel):
    original_theme: str
    improved_star_bullet: str
    impact_explanation: str

class AIInsights(BaseModel):
    is_ai_generated: bool
    provider: str  # "Google Gemini API" or "ResumeGenie Deterministic Engine"
    executive_summary: str
    bullet_rewrites: List[BulletRewrite]
    interview_questions: List[str]
    custom_career_advice: str

class ImprovementSuggestions(BaseModel):
    content_improvements: List[str]
    project_recommendations: List[ProjectRecommendation]
    learning_roadmaps: List[Dict[str, Any]]
    quick_wins: List[str]

class AnalysisResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_kb: float
    created_at: str
    candidate_name: Optional[str]
    candidate_email: Optional[str]
    candidate_phone: Optional[str]
    total_score: int
    target_role: Optional[str]
    scores_breakdown: ScoreBreakdown
    extracted_data: ExtractedResumeData
    analysis_findings: AnalysisFindings
    career_matches: List[CareerMatchItem]
    suggestions: ImprovementSuggestions
    ai_insights: AIInsights

class HistoryItem(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_kb: float
    created_at: str
    candidate_name: Optional[str]
    candidate_email: Optional[str]
    total_score: int
    target_role: Optional[str]
    top_career_match: Optional[str] = None
    all_skills_count: int = 0
