import io
import re
from typing import Dict, List, Tuple, Optional
import pymupdf as fitz
from docx import Document
from fastapi import HTTPException

# Common section headers pattern mapping
SECTION_PATTERNS = {
    "summary": [
        r"(?:^|\n)\s*(?:professional\s+)?summary\b",
        r"(?:^|\n)\s*(?:career\s+)?objective\b",
        r"(?:^|\n)\s*about\s+me\b",
        r"(?:^|\n)\s*profile\b"
    ],
    "education": [
        r"(?:^|\n)\s*education\b",
        r"(?:^|\n)\s*academic(?:\s+background|\s+history|\s+qualifications)?\b",
        r"(?:^|\n)\s*qualifications\b"
    ],
    "experience": [
        r"(?:^|\n)\s*(?:work\s+|professional\s+)?experience\b",
        r"(?:^|\n)\s*employment(?:\s+history)?\b",
        r"(?:^|\n)\s*internships?\b",
        r"(?:^|\n)\s*work\s+history\b"
    ],
    "skills": [
        r"(?:^|\n)\s*(?:technical\s+|core\s+)?skills\b",
        r"(?:^|\n)\s*technologies\b",
        r"(?:^|\n)\s*tech\s+stack\b",
        r"(?:^|\n)\s*proficiencies\b",
        r"(?:^|\n)\s*competencies\b"
    ],
    "projects": [
        r"(?:^|\n)\s*(?:key\s+|personal\s+|academic\s+)?projects\b",
        r"(?:^|\n)\s*notable\s+projects\b"
    ],
    "certifications": [
        r"(?:^|\n)\s*(?:licenses\s+and\s+)?certifications?\b",
        r"(?:^|\n)\s*certificates?\b",
        r"(?:^|\n)\s*courses\b"
    ],
    "achievements": [
        r"(?:^|\n)\s*(?:honors\s+and\s+)?awards?\b",
        r"(?:^|\n)\s*achievements?\b",
        r"(?:^|\n)\s*extracurricular(?:\s+activities)?\b"
    ]
}

STANDARD_CORE_SECTIONS = [
    "Contact Information",
    "Summary / Objective",
    "Education",
    "Skills",
    "Experience / Projects"
]

def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, int]:
    """Extracts text from PDF bytes using PyMuPDF."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to parse PDF file. The file may be corrupt or encrypted. Error: {str(e)}"
        )
    
    page_count = len(doc)
    text_pieces = []
    
    for page_idx in range(page_count):
        page = doc[page_idx]
        page_text = page.get_text("text")
        if page_text:
            text_pieces.append(page_text)
            
    doc.close()
    full_text = "\n".join(text_pieces).strip()
    
    if len(full_text) < 40:
        raise HTTPException(
            status_code=422,
            detail=(
                "The uploaded PDF contains very little or no extractable text. "
                "It may be a scanned image or empty. Please upload a standard text-based PDF or DOCX."
            )
        )
        
    return full_text, page_count

def extract_text_from_docx(file_bytes: bytes) -> Tuple[str, int]:
    """Extracts text from DOCX bytes including paragraphs and table contents."""
    try:
        doc = Document(io.BytesIO(file_bytes))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to parse DOCX file. The file may be corrupt. Error: {str(e)}"
        )
        
    text_pieces = []
    for paragraph in doc.paragraphs:
        p_text = paragraph.text.strip()
        if p_text:
            text_pieces.append(p_text)
            
    # Also extract tables (many resume templates use tables for skills & two-column layouts)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                c_text = cell.text.strip()
                if c_text and c_text not in text_pieces:
                    text_pieces.append(c_text)
                    
    full_text = "\n".join(text_pieces).strip()
    
    if len(full_text) < 40:
        raise HTTPException(
            status_code=422,
            detail="The uploaded DOCX file is empty or contains insufficient text."
        )
        
    # Approximate page count for docx
    words = len(full_text.split())
    approx_pages = max(1, (words // 450) + (1 if words % 450 > 100 else 0))
    return full_text, approx_pages

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extracts name, email, phone, and professional links from resume text."""
    # Email regex
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email_match.group(0) if email_match else None
    
    # Phone regex
    phone_match = re.search(
        r"(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,13}",
        text
    )
    phone = phone_match.group(0).strip() if phone_match else None
    
    # LinkedIn
    linkedin_match = re.search(r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)", text, re.I)
    linkedin = linkedin_match.group(0) if linkedin_match else None
    
    # GitHub
    github_match = re.search(r"(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)", text, re.I)
    github = github_match.group(0) if github_match else None
    
    # Portfolio / general link
    portfolio_match = re.search(
        r"(?:https?:\/\/)?([a-zA-Z0-9_-]+\.(?:dev|me|io|tech|app|vercel\.app|netlify\.app|portfolio))\b",
        text,
        re.I
    )
    portfolio = portfolio_match.group(0) if portfolio_match else None
    
    # Candidate name extraction heuristic:
    # Look at the first 5 non-empty lines before email/phone
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    candidate_name = None
    
    for idx, line in enumerate(lines[:5]):
        # Filter out lines that look like emails, URLs, phones, or section titles
        if "@" in line or "http" in line or "linkedin" in line or "github" in line:
            continue
        if any(char.isdigit() for char in line) and len(line) < 25:
            continue
        # Words check: usually 1 to 4 words, letters only
        words = line.split()
        if 1 <= len(words) <= 4 and all(re.match(r"^[A-Za-z.'-]+$", w) for w in words):
            # Avoid words like "Resume", "Curriculum Vitae"
            lower_line = line.lower()
            if "resume" in lower_line or "curriculum" in lower_line or "cv" == lower_line:
                continue
            # If only a single word (e.g. first name 'GINA'), check if the next line is the last name (e.g. 'JONES')
            if len(words) == 1 and idx + 1 < len(lines):
                next_line = lines[idx + 1].strip()
                next_words = next_line.split()
                if len(next_words) == 1 and re.match(r"^[A-Za-z.'-]+$", next_words[0]):
                    not_titles = {"developer", "engineer", "designer", "intern", "manager", "analyst", "lead", "architect", "consultant"}
                    if next_words[0].lower() not in not_titles and "@" not in next_line and not any(c.isdigit() for c in next_line):
                        candidate_name = f"{line} {next_line}"
                        break
            candidate_name = line
            break

    return {
        "name": candidate_name or "Candidate",
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio
    }

def detect_sections(text: str) -> Tuple[Dict[str, str], List[str], List[str]]:
    """
    Identifies resume sections and separates their contents.
    Returns:
      (sections_dict, detected_names, missing_core_sections)
    """
    # Track positions of section headers
    section_positions = []
    
    for section_name, patterns in SECTION_PATTERNS.items():
        for pattern in patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                section_positions.append((match.start(), section_name, match.group(0).strip()))
                
    # Sort section headers by their appearance index
    section_positions.sort(key=lambda x: x[0])
    
    # Remove duplicates close to each other
    unique_positions = []
    seen_sections = set()
    for pos, sec_name, matched_str in section_positions:
        if sec_name not in seen_sections:
            unique_positions.append((pos, sec_name, matched_str))
            seen_sections.add(sec_name)
            
    sections_dict: Dict[str, str] = {}
    
    if not unique_positions:
        # Fallback: whole text treated as general
        sections_dict["general"] = text
    else:
        # Preamble before first header (usually contact info & top summary)
        if unique_positions[0][0] > 0:
            sections_dict["contact_and_header"] = text[:unique_positions[0][0]].strip()
            
        for i in range(len(unique_positions)):
            pos, sec_name, _ = unique_positions[i]
            end_pos = unique_positions[i+1][0] if i+1 < len(unique_positions) else len(text)
            sections_dict[sec_name] = text[pos:end_pos].strip()

    detected_names = []
    for k in sections_dict.keys():
        if k != "contact_and_header" and k != "general":
            detected_names.append(k.replace("_", " ").title())

    # Check for missing core sections
    missing_core = []
    # Contact info check
    email_or_phone = bool(re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text) or
                          re.search(r"\d{3}[-.\s]?\d{3}[-.\s]?\d{4}", text))
    if not email_or_phone:
        missing_core.append("Contact Information")
        
    if "summary" not in sections_dict:
        missing_core.append("Summary / Objective")
    if "education" not in sections_dict:
        missing_core.append("Education")
    if "skills" not in sections_dict:
        missing_core.append("Skills")
    if "experience" not in sections_dict and "projects" not in sections_dict:
        missing_core.append("Experience / Projects")

    return sections_dict, detected_names, missing_core
