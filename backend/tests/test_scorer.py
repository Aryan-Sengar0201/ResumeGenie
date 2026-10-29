import pytest
from app.services.scorer import calculate_heuristic_score, analyze_text_metrics

def test_analyze_text_metrics():
    text = "Engineered 12 REST APIs, improved latency by 35% and scaled to 50,000+ users. Saved $5,000 in costs."
    verbs, metrics = analyze_text_metrics(text)
    
    assert "Engineered" in verbs or "Improved" in verbs or "Scaled" in verbs
    assert any("35%" in m for m in metrics)
    assert any("50,000+" in m for m in metrics)
    assert any("$5,000" in m for m in metrics)

def test_calculate_heuristic_score_full():
    sample_text = (
        "Alex Mercer\n"
        "alex@example.com | 555-123-4567 | github.com/alex | linkedin.com/in/alex\n\n"
        "Summary\n"
        "Full stack engineer with 3 years experience building cloud services.\n\n"
        "Education\n"
        "B.S. in Computer Science\n\n"
        "Skills\n"
        "Python, React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Git, Problem Solving, Communication\n\n"
        "Experience\n"
        "Engineered 10+ REST microservices with Node.js and PostgreSQL. Improved query speeds by 40%.\n"
        "Architected responsive dashboard in React, increasing user engagement by 25% across 10,000+ users.\n"
        "Automated deployment workflows using GitHub Actions and Docker, reducing release time by 50%.\n"
    )
    
    sections = {
        "summary": "Full stack engineer...",
        "education": "B.S. in Computer Science",
        "skills": "Python, React, TypeScript, Node.js...",
        "experience": "Engineered 10+ REST microservices..."
    }
    
    contact_info = {
        "email": "alex@example.com",
        "phone": "555-123-4567",
        "github": "github.com/alex",
        "linkedin": "linkedin.com/in/alex"
    }
    
    skills_by_cat = {
        "programming_languages": ["Python", "TypeScript"],
        "frontend": ["React"],
        "backend": ["Node.js"],
        "databases": ["PostgreSQL"],
        "cloud_devops": ["Docker", "AWS"],
        "tools_frameworks": ["Git"],
        "soft_skills": ["Problem Solving", "Communication"]
    }
    
    all_skills = ["Python", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS", "Git", "Problem Solving", "Communication"]
    
    breakdown, findings, strengths, weaknesses = calculate_heuristic_score(
        sample_text, sections, contact_info, skills_by_cat, all_skills
    )
    
    assert 0 <= breakdown["total_score"] <= 100
    assert breakdown["total_score"] >= 70  # Strong resume should score well
    assert "Transparent Heuristic Score" in breakdown["disclaimer"]
    assert breakdown["section_completeness"]["score"] > 15
    assert len(strengths) > 0
    assert findings["action_verbs_count"] >= 2
    assert findings["quantified_metrics_count"] >= 2
