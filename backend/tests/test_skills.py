import pytest
from app.services.skills_extractor import extract_skills

def test_extract_skills_technical():
    sample_text = """
    Proficient in Python, TypeScript, React, Node.js, and PostgreSQL.
    Experience with Docker containerization, AWS deployments, and Git.
    Familiar with PyTorch and Machine Learning algorithms.
    Strong Problem Solving and Communication abilities.
    """
    categorized, all_skills = extract_skills(sample_text)
    
    # Check languages
    assert "Python" in categorized["programming_languages"]
    assert "TypeScript" in categorized["programming_languages"]
    
    # Check frontend
    assert "React" in categorized["frontend"]
    
    # Check backend
    assert "Node.js" in categorized["backend"]
    
    # Check databases
    assert "PostgreSQL" in categorized["databases"]
    
    # Check cloud/devops
    assert "Docker" in categorized["cloud_devops"]
    assert "AWS" in categorized["cloud_devops"]
    
    # Check AI/ML
    assert "PyTorch" in categorized["ai_ml_data"]
    assert "Machine Learning" in categorized["ai_ml_data"]
    
    # Check soft skills
    assert "Problem Solving" in categorized["soft_skills"]
    assert "Communication" in categorized["soft_skills"]
    
    # All skills count
    assert len(all_skills) >= 8

def test_extract_skills_edge_cases():
    # Test that normal words don't falsely trigger single-letter skills
    text = "I like to go for a run in the park and drive my car."
    categorized, all_skills = extract_skills(text)
    assert "C" not in all_skills
    assert "R" not in all_skills
