import json
import logging
import re
from typing import List, Dict, Any, Optional
import httpx
from ..config import settings
from .fallback_service import generate_deterministic_insights

logger = logging.getLogger(__name__)

async def generate_ai_insights(
    candidate_name: str,
    total_score: int,
    all_skills: List[str],
    top_career: str,
    missing_skills: List[str],
    weaknesses: List[str],
    resume_text_sample: str
) -> Dict[str, Any]:
    """
    Calls Google Gemini API when GEMINI_API_KEY is configured.
    Gracefully and seamlessly falls back to the deterministic engine
    if key is missing, network is unavailable, or quota is exceeded.
    """
    # Deterministic fallback baseline
    fallback_data = generate_deterministic_insights(
        candidate_name=candidate_name,
        total_score=total_score,
        all_skills=all_skills,
        top_career=top_career,
        missing_skills=missing_skills,
        weaknesses=weaknesses
    )

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.info("No GEMINI_API_KEY configured. Utilizing deterministic heuristic engine.")
        return fallback_data

    # Truncate text sample for prompt token economy
    sample_snippet = resume_text_sample[:2500]
    prompt = f"""
You are ResumeGenie's Senior Technical Recruiter & Career Advisor.
Analyze the following candidate resume profile and provide high-impact, actionable recommendations.

Candidate Name: {candidate_name}
Heuristic Score: {total_score}/100
Identified Skills: {', '.join(all_skills[:15])}
Top Matched Career Role: {top_career}
Identified Skill Gaps: {', '.join(missing_skills[:8])}
Resume Snippet:
{sample_snippet}

Respond ONLY with a valid JSON object matching this exact schema (no markdown fences, just pure JSON):
{{
  "executive_summary": "A 2-3 sentence strategic summary analyzing their standing for {top_career}.",
  "bullet_rewrites": [
    {{
      "original_theme": "Brief description of the weakness in common bullet points",
      "improved_star_bullet": "High-impact STAR format bullet starting with a strong action verb and quantified outcome.",
      "impact_explanation": "Why this change is significantly more persuasive to hiring managers."
    }},
    {{
      "original_theme": "Second bullet point theme needing improvement",
      "improved_star_bullet": "High-impact STAR bullet point with concrete metrics and technical depth.",
      "impact_explanation": "Explanation of improvement."
    }},
    {{
      "original_theme": "Third bullet point theme needing improvement",
      "improved_star_bullet": "High-impact STAR bullet point emphasizing architecture or scale.",
      "impact_explanation": "Explanation of improvement."
    }}
  ],
  "interview_questions": [
    "Technical question 1 directly probing one of their core skills",
    "Technical question 2 probing system design or edge cases",
    "Technical question 3 exploring how they would acquire or use {missing_skills[0] if missing_skills else 'cloud services'}"
  ],
  "custom_career_advice": "Actionable career guidance tailored to their profile.",
  "project_recommendations": [
    {{
      "title": "Title of project to bridge skill gaps",
      "description": "Specific functional requirements and architecture",
      "skills_covered": ["Skill1", "Skill2"],
      "difficulty": "Intermediate"
    }},
    {{
      "title": "Second portfolio project",
      "description": "Detailed project description",
      "skills_covered": ["Skill1", "Skill2"],
      "difficulty": "Advanced"
    }}
  ]
}}
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 2048
        }
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        raw_text = parts[0]["text"].strip()
                        # Clean json fences if present
                        if raw_text.startswith("```json"):
                            raw_text = raw_text[7:]
                        if raw_text.startswith("```"):
                            raw_text = raw_text[3:]
                        if raw_text.endswith("```"):
                            raw_text = raw_text[:-3]
                        raw_text = raw_text.strip()
                        
                        parsed = json.loads(raw_text)
                        
                        # Merge with fallback to ensure all fields exist
                        return {
                            "is_ai_generated": True,
                            "provider": f"Google Gemini API ({settings.GEMINI_MODEL})",
                            "executive_summary": parsed.get("executive_summary", fallback_data["executive_summary"]),
                            "bullet_rewrites": parsed.get("bullet_rewrites", fallback_data["bullet_rewrites"]),
                            "interview_questions": parsed.get("interview_questions", fallback_data["interview_questions"]),
                            "custom_career_advice": parsed.get("custom_career_advice", fallback_data["custom_career_advice"]),
                            "project_recommendations": parsed.get("project_recommendations", fallback_data["project_recommendations"]),
                            "learning_roadmaps": fallback_data["learning_roadmaps"],
                            "content_improvements": fallback_data["content_improvements"],
                            "quick_wins": fallback_data["quick_wins"]
                        }
            else:
                logger.warning(
                    f"Gemini API returned status code {response.status_code}: {response.text}. Using fallback."
                )
    except Exception as e:
        logger.warning(f"Gemini API request failed ({str(e)}). Seamlessly using deterministic fallback.")

    return fallback_data
