export interface ScoreCategory {
  name: string;
  score: number;
  max_score: number;
  feedback: string;
}

export interface ScoreBreakdown {
  total_score: number;
  max_score: number;
  section_completeness: ScoreCategory;
  skills_depth: ScoreCategory;
  action_verbs_impact: ScoreCategory;
  readability_structure: ScoreCategory;
  experience_projects: ScoreCategory;
  disclaimer: string;
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface CategorizedSkills {
  programming_languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud_devops: string[];
  ai_ml_data: string[];
  tools_frameworks: string[];
  soft_skills: string[];
}

export interface ExtractedResumeData {
  contact_info: ContactInfo;
  sections_detected: string[];
  missing_sections: string[];
  word_count: number;
  char_count: number;
  estimated_read_time_seconds: number;
  skills_by_category: CategorizedSkills;
  all_skills: string[];
  text_preview: string;
}

export interface AnalysisFindings {
  action_verbs_count: number;
  action_verbs_found: string[];
  quantified_metrics_count: number;
  quantified_snippets: string[];
  has_bullet_points: boolean;
  readability_rating: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CareerMatchItem {
  role_title: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  priority_skills: string[];
  rationale: string;
  demand_level: string;
  average_salary_range: string;
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  skills_covered: string[];
  difficulty: string;
}

export interface BulletRewrite {
  original_theme: string;
  improved_star_bullet: string;
  impact_explanation: string;
}

export interface AIInsights {
  is_ai_generated: boolean;
  provider: string;
  executive_summary: string;
  bullet_rewrites: BulletRewrite[];
  interview_questions: string[];
  custom_career_advice: string;
}

export interface ImprovementSuggestions {
  content_improvements: string[];
  project_recommendations: ProjectRecommendation[];
  learning_roadmaps: Array<{
    skill: string;
    estimated_weeks: number;
    steps: string[];
  }>;
  quick_wins: string[];
}

export interface AnalysisResponse {
  id: string;
  filename: string;
  file_type: string;
  file_size_kb: number;
  created_at: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_phone?: string;
  total_score: number;
  target_role?: string;
  scores_breakdown: ScoreBreakdown;
  extracted_data: ExtractedResumeData;
  analysis_findings: AnalysisFindings;
  career_matches: CareerMatchItem[];
  suggestions: ImprovementSuggestions;
  ai_insights: AIInsights;
}

export interface HistoryItem {
  id: string;
  filename: string;
  file_type: string;
  file_size_kb: number;
  created_at: string;
  candidate_name?: string;
  candidate_email?: string;
  total_score: number;
  target_role?: string;
  top_career_match?: string;
  all_skills_count: number;
}

export interface RoleBenchmark {
  title: string;
  core_skills: string[];
  secondary_skills: string[];
  description: string;
  demand_level: string;
  salary_range: string;
}

export interface SkillGapData {
  role_title: string;
  match_percentage: number;
  projected_match_with_priorities: number;
  matched_skills: string[];
  missing_skills: string[];
  priority_learning_order: string[];
  recommended_certifications: string[];
  role_description: string;
}
