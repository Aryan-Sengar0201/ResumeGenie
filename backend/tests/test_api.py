import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "ResumeGenie"

def test_get_roles():
    response = client.get("/api/roles")
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) >= 8
    role_titles = [r["title"] for r in roles]
    assert "Full Stack Developer" in role_titles
    assert "Data Scientist" in role_titles

def test_analyze_sample_swe():
    response = client.post("/api/sample/swe?target_role=Full%20Stack%20Developer")
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] is not None
    assert data["candidate_name"] == "Alex Mercer"
    assert data["total_score"] > 60
    assert len(data["career_matches"]) > 0
    assert len(data["extracted_data"]["all_skills"]) > 5
    assert "scores_breakdown" in data
    assert "suggestions" in data
    assert "ai_insights" in data

    # Verify report PDF download for this analysis
    analysis_id = data["id"]
    pdf_resp = client.get(f"/api/report/{analysis_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 1000  # Valid PDF binary

def test_analyze_sample_data_analyst():
    response = client.post("/api/sample/data?target_role=Data%20Analyst")
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] is not None
    assert data["candidate_name"] == "Maya Lin"
    assert data["file_type"] == "docx"
    assert data["total_score"] > 60
    assert "Data Analyst" in [m["role_title"] for m in data["career_matches"][:3]]

def test_skill_gap_endpoint():
    req_body = {
        "role_title": "Full Stack Developer",
        "current_skills": ["JavaScript", "HTML / HTML5", "CSS / CSS3"]
    }
    response = client.post("/api/skill-gap", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert data["role_title"] == "Full Stack Developer"
    assert "React" in data["missing_skills"] or "Node.js" in data["missing_skills"]
    assert "priority_learning_order" in data

def test_history_and_delete():
    # Fetch history
    history_resp = client.get("/api/analyses")
    assert history_resp.status_code == 200
    items = history_resp.json()
    assert len(items) >= 1
    
    # Check single item get
    first_id = items[0]["id"]
    single_resp = client.get(f"/api/analyses/{first_id}")
    assert single_resp.status_code == 200
    assert single_resp.json()["id"] == first_id

    # Test delete
    del_resp = client.delete(f"/api/analyses/{first_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "success"
