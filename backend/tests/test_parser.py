import pytest
from pathlib import Path
from app.services.parser import (
    extract_text_from_pdf, extract_text_from_docx,
    extract_contact_info, detect_sections
)

SAMPLES_DIR = Path(__file__).resolve().parent.parent / "app" / "sample_resumes"

def test_extract_text_from_pdf():
    pdf_path = SAMPLES_DIR / "sample_software_engineer.pdf"
    assert pdf_path.exists(), "Sample PDF must exist"
    
    with open(pdf_path, "rb") as f:
        text, pages = extract_text_from_pdf(f.read())
        
    assert len(text) > 100
    assert pages >= 1
    assert "Alex Mercer" in text
    assert "TechNova Solutions" in text

def test_extract_text_from_docx():
    docx_path = SAMPLES_DIR / "sample_data_analyst.docx"
    assert docx_path.exists(), "Sample DOCX must exist"
    
    with open(docx_path, "rb") as f:
        text, pages = extract_text_from_docx(f.read())
        
    assert len(text) > 100
    assert "Maya Lin" in text
    # Checks that tables were extracted
    assert "Pandas" in text or "Tableau" in text

def test_extract_contact_info():
    sample_text = """
    Jane Doe
    jane.doe@university.edu
    +1 (555) 987-6543
    linkedin.com/in/janedoe
    github.com/janedoe
    """
    contact = extract_contact_info(sample_text)
    assert contact["name"] == "Jane Doe"
    assert contact["email"] == "jane.doe@university.edu"
    assert "555" in (contact["phone"] or "")
    assert "janedoe" in (contact["linkedin"] or "")
    assert "janedoe" in (contact["github"] or "")

def test_detect_sections():
    sample_text = """
    John Smith
    Summary
    Experienced developer with a passion for web technologies.
    
    Education
    B.S. in Computer Science
    
    Technical Skills
    Python, React, SQL
    
    Work Experience
    Software Engineer at Acme Corp. Built web portals.
    """
    sections, detected, missing = detect_sections(sample_text)
    assert "summary" in sections
    assert "education" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "Education" in detected
    assert len(missing) == 0 or "Contact Information" in missing
