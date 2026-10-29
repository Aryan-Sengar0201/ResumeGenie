import re
from typing import Dict, List, Any, Tuple

ACTION_VERBS = [
    "accelerated", "achieved", "administered", "architected", "automated",
    "built", "collaborated", "configured", "constructed", "created",
    "debugged", "decreased", "delivered", "deployed", "designed", "developed",
    "engineered", "enhanced", "established", "executed", "expanded",
    "facilitated", "formulated", "founded", "generated", "guided",
    "implemented", "improved", "increased", "initiated", "innovated", "integrated",
    "launched", "led", "managed", "maximized", "mentored", "migrated", "modernized",
    "optimized", "orchestrated", "organized", "overhauled", "pioneered", "produced",
    "reduced", "refactored", "resolved", "revamped", "scaled", "simplified",
    "spearheaded", "standardized", "streamlined", "supervised", "tested", "transformed"
]

METRIC_PATTERNS = [
    r"\b\d+%(?!\w)",                          # e.g., 25%, 100%
    r"\$\d+(?:,\d+)*(?:\.\d+)?(?:k|m|b)?\b",  # e.g., $10k, $500,000
    r"\b\d+(?:x|X)\b",                        # e.g., 3x, 10x
    r"\b\d+(?:,\d+)*(?:\+)?\s*(?:users|clients|customers|requests|queries|downloads|stars|members|engineers|students)\b",
    r"\breduced\s+(?:by\s+)?\d+",
    r"\bincreased\s+(?:by\s+)?\d+",
    r"\bsaved\s+(?:\$)?\d+"
]

def analyze_text_metrics(text: str) -> Tuple[List[str], List[str]]:
    """Identifies action verbs and quantified impact snippets in text."""
    lower_text = text.lower()
    
    # Action verbs
    found_verbs = set()
    for verb in ACTION_VERBS:
        if re.search(r"\b" + verb + r"\b", lower_text):
            found_verbs.add(verb.capitalize())
            
    # Metrics
    found_metrics = []
    for pat in METRIC_PATTERNS:
        matches = re.finditer(pat, text, re.IGNORECASE)
        for m in matches:
            found_metrics.append(m.group(0).strip())
            
    return sorted(list(found_verbs)), found_metrics

def calculate_heuristic_score(
    text: str,
    sections: Dict[str, str],
    contact_info: Dict[str, Any],
    skills_by_cat: Dict[str, List[str]],
    all_skills: List[str]
) -> Tuple[Dict[str, Any], Dict[str, Any], List[str], List[str]]:
    """
    Computes a 0-100 score across 5 transparent pillars:
    1. Section Completeness (25)
    2. Skills Depth & Breadth (25)
    3. Action Verbs & Impact (20)
    4. Structure & Readability (15)
    5. Experience & Project Substance (15)
    """
    strengths: List[str] = []
    weaknesses: List[str] = []

    words = text.split()
    word_count = len(words)
    
    # ---------------- 1. Section Completeness (Max 25) ----------------
    completeness_pts = 0
    comp_feedback = []
    
    # Contact (5)
    if contact_info.get("email") and contact_info.get("phone"):
        completeness_pts += 5
        comp_feedback.append("Complete contact details (email & phone).")
    elif contact_info.get("email") or contact_info.get("phone"):
        completeness_pts += 3
        comp_feedback.append("Partial contact info (either phone or email missing).")
    else:
        comp_feedback.append("Missing email and phone number.")

    # Professional links (3)
    if contact_info.get("linkedin") or contact_info.get("github") or contact_info.get("portfolio"):
        completeness_pts += 3
        comp_feedback.append("Included professional profiles (LinkedIn/GitHub).")
        strengths.append("Includes clickable professional links (GitHub/LinkedIn).")
    else:
        weaknesses.append("No GitHub or LinkedIn profile links detected.")

    # Education (5)
    if "education" in sections:
        completeness_pts += 5
        comp_feedback.append("Education section detected.")
    else:
        weaknesses.append("Missing dedicated Education section.")

    # Skills (5)
    if "skills" in sections or len(all_skills) >= 4:
        completeness_pts += 5
        comp_feedback.append("Skills section present.")
    else:
        weaknesses.append("Missing explicit Skills section.")

    # Experience or Projects (7)
    if "experience" in sections and "projects" in sections:
        completeness_pts += 7
        comp_feedback.append("Both Work Experience and Project sections present.")
        strengths.append("Balanced inclusion of both Work Experience and Projects.")
    elif "experience" in sections or "projects" in sections:
        completeness_pts += 5
        comp_feedback.append("Contains project or experience section.")
    else:
        weaknesses.append("Missing both Experience and Projects sections.")

    completeness_pts = min(25, completeness_pts)

    # ---------------- 2. Skills Depth & Breadth (Max 25) ----------------
    skills_pts = 0
    skills_feedback = []
    tech_skills_count = len(all_skills) - len(skills_by_cat.get("soft_skills", []))
    
    # Tech skills quantity (15)
    if tech_skills_count >= 12:
        skills_pts += 15
        skills_feedback.append(f"Exceptional technical breadth ({tech_skills_count} tech skills).")
        strengths.append(f"Strong technical skill breadth with {tech_skills_count}+ identified tools.")
    elif tech_skills_count >= 8:
        skills_pts += 12
        skills_feedback.append(f"Solid technical skills base ({tech_skills_count} tech skills).")
    elif tech_skills_count >= 4:
        skills_pts += 8
        skills_feedback.append("Moderate skill count. Consider highlighting additional libraries or tools.")
    else:
        skills_pts += 3
        weaknesses.append("Low count of recognizable technical skills (< 4 detected).")

    # Categories diversity (6)
    active_cats = sum(1 for cat, slist in skills_by_cat.items() if len(slist) > 0 and cat != "soft_skills")
    if active_cats >= 4:
        skills_pts += 6
        skills_feedback.append(f"Multi-disciplinary domain coverage ({active_cats} technical domains).")
        strengths.append("Well-rounded domain coverage (languages, databases, backend/frontend, DevOps).")
    elif active_cats >= 2:
        skills_pts += 4
        skills_feedback.append(f"Covers {active_cats} technical categories.")
    else:
        skills_pts += 2
        weaknesses.append("Skills are concentrated in very few technical categories.")

    # Soft skills (4)
    soft_count = len(skills_by_cat.get("soft_skills", []))
    if soft_count >= 2:
        skills_pts += 4
        skills_feedback.append(f"Contains {soft_count} complementary soft/leadership skills.")
    elif soft_count == 1:
        skills_pts += 2
        skills_feedback.append("Has 1 soft skill mentioned.")
    else:
        weaknesses.append("Consider demonstrating soft skills (collaboration, leadership, problem-solving).")

    skills_pts = min(25, skills_pts)

    # ---------------- 3. Action Verbs & Impact (Max 20) ----------------
    action_verbs_found, metrics_found = analyze_text_metrics(text)
    action_pts = 0
    action_feedback = []

    # Verbs (10)
    verb_count = len(action_verbs_found)
    if verb_count >= 8:
        action_pts += 10
        action_feedback.append(f"Vibrant action orientation ({verb_count} distinct power verbs).")
        strengths.append(f"Dynamic language with {verb_count} strong action verbs.")
    elif verb_count >= 4:
        action_pts += 7
        action_feedback.append(f"Moderate action verb usage ({verb_count} verbs).")
    elif verb_count >= 1:
        action_pts += 4
        action_feedback.append("Limited action verbs. Replace passive phrases with strong action verbs.")
    else:
        weaknesses.append("Passive tone detected. Use verbs like 'Engineered', 'Optimized', 'Deployed'.")

    # Metrics (10)
    metric_count = len(metrics_found)
    if metric_count >= 4:
        action_pts += 10
        action_feedback.append(f"Highly quantified achievements ({metric_count} metric points).")
        strengths.append(f"Quantifiable results highlighted with {metric_count} concrete figures.")
    elif metric_count >= 2:
        action_pts += 6
        action_feedback.append(f"Some quantification present ({metric_count} metrics).")
    elif metric_count == 1:
        action_pts += 3
        action_feedback.append("Only 1 metric found. Quantify more outcomes (e.g. latency, user volume).")
    else:
        weaknesses.append("Lack of quantified metrics (% improved, ms latency cut, user count).")

    action_pts = min(20, action_pts)

    # ---------------- 4. Readability & Structure (Max 15) ----------------
    readability_pts = 0
    read_feedback = []
    
    # Word count (6)
    if 350 <= word_count <= 850:
        readability_pts += 6
        read_feedback.append(f"Optimal length ({word_count} words, ~1-2 pages standard).")
        strengths.append(f"Ideal concise resume length ({word_count} words).")
    elif 250 <= word_count < 350 or 850 < word_count <= 1100:
        readability_pts += 4
        read_feedback.append(f"Acceptable length ({word_count} words), but could be optimized.")
    else:
        readability_pts += 2
        weaknesses.append(f"Resume word count ({word_count} words) is either too sparse or too verbose.")

    # Bullet points (5)
    has_bullets = any(sym in text for sym in ["•", "-", "*", "▪", "–", "—"])
    if has_bullets:
        readability_pts += 5
        read_feedback.append("Scannable bullet points used for readability.")
    else:
        weaknesses.append("Few or no clear bullet points detected. Avoid dense prose paragraphs.")

    # Contact clarity / layout hygiene (4)
    if "\n\n" in text or len(sections) >= 3:
        readability_pts += 4
        read_feedback.append("Good section spacing and visual separation.")
    else:
        readability_pts += 2

    readability_pts = min(15, readability_pts)

    # ---------------- 5. Experience & Projects Substance (Max 15) ----------------
    exp_pts = 0
    exp_feedback = []
    exp_text = sections.get("experience", "") + " " + sections.get("projects", "")
    exp_words = len(exp_text.split())

    if exp_words >= 150:
        exp_pts += 10
        exp_feedback.append("In-depth detail in experience and project narratives.")
    elif exp_words >= 75:
        exp_pts += 7
        exp_feedback.append("Adequate project/work detail.")
    else:
        exp_pts += 3
        weaknesses.append("Sparse project/experience descriptions. Elaborate on what you built.")

    # Tech stack integration in projects (5)
    tech_in_exp = sum(1 for skill in all_skills if re.search(r"\b" + re.escape(skill) + r"\b", exp_text, re.I))
    if tech_in_exp >= 4:
        exp_pts += 5
        exp_feedback.append(f"Technologies actively contextualized in projects ({tech_in_exp} tools cited).")
        strengths.append("Skills are demonstrated within context of actual projects and experience.")
    elif tech_in_exp >= 2:
        exp_pts += 3
        exp_feedback.append("Some skills tied to project deliverables.")
    else:
        exp_pts += 1

    exp_pts = min(15, exp_pts)

    # ---------------- Overall Aggregate Score ----------------
    total_score = completeness_pts + skills_pts + action_pts + readability_pts + exp_pts

    scores_breakdown = {
        "total_score": total_score,
        "max_score": 100,
        "section_completeness": {
            "name": "Section Completeness",
            "score": completeness_pts,
            "max_score": 25,
            "feedback": " ".join(comp_feedback)
        },
        "skills_depth": {
            "name": "Skills Depth & Breadth",
            "score": skills_pts,
            "max_score": 25,
            "feedback": " ".join(skills_feedback)
        },
        "action_verbs_impact": {
            "name": "Impact & Action Verbs",
            "score": action_pts,
            "max_score": 20,
            "feedback": " ".join(action_feedback)
        },
        "readability_structure": {
            "name": "Formatting & Readability",
            "score": readability_pts,
            "max_score": 15,
            "feedback": " ".join(read_feedback)
        },
        "experience_projects": {
            "name": "Experience & Project Depth",
            "score": exp_pts,
            "max_score": 15,
            "feedback": " ".join(exp_feedback)
        },
        "disclaimer": (
            "Transparent Heuristic Score: For educational and guidance purposes. "
            "This score is calculated using transparent rule-based heuristics and is NOT "
            "an official ATS score or a guarantee of hiring outcomes."
        )
    }

    findings = {
        "action_verbs_count": len(action_verbs_found),
        "action_verbs_found": action_verbs_found[:12],
        "quantified_metrics_count": len(metrics_found),
        "quantified_snippets": metrics_found[:8],
        "has_bullet_points": has_bullets,
        "readability_rating": "Excellent" if total_score >= 80 else ("Good" if total_score >= 60 else "Needs Improvement"),
        "strengths": strengths if strengths else ["Basic resume layout is intact."],
        "weaknesses": weaknesses if weaknesses else ["Minor formatting adjustments can further elevate the resume."]
    }

    return scores_breakdown, findings, strengths, weaknesses
