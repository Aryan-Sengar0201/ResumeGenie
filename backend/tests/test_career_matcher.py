import pytest
from app.services.career_matcher import match_all_careers, get_skill_gap_for_role

def test_match_all_careers():
    candidate_skills = ["JavaScript", "React", "Node.js", "SQL", "Git", "TypeScript"]
    matches = match_all_careers(candidate_skills)
    
    assert len(matches) > 0
    # Top match should be Full Stack or Frontend
    top_role = matches[0]["role_title"]
    assert top_role in ["Full Stack Developer", "Frontend Developer", "Backend Engineer"]
    assert matches[0]["match_percentage"] >= 60
    assert len(matches[0]["matched_skills"]) >= 3

def test_get_skill_gap_for_role():
    candidate_skills = ["Python", "SQL", "Git"]
    gap = get_skill_gap_for_role("Data Scientist", candidate_skills)
    
    assert gap["role_title"] == "Data Scientist"
    assert "Python" in gap["matched_skills"]
    assert "SQL" in gap["matched_skills"]
    assert "Machine Learning" in gap["missing_skills"]
    assert len(gap["priority_learning_order"]) > 0
    assert gap["projected_match_with_priorities"] > gap["match_percentage"]
