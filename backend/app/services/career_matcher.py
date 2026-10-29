from typing import Dict, List, Any, Optional

CAREER_ROLES = {
    "Full Stack Developer": {
        "core_skills": ["JavaScript", "React", "Node.js", "REST APIs", "SQL", "Git"],
        "secondary_skills": ["TypeScript", "Docker", "PostgreSQL", "MongoDB", "Tailwind CSS", "Next.js", "Express"],
        "description": "Architects and maintains both customer-facing UI applications and backend server services.",
        "demand_level": "Very High",
        "salary_range": "$90,000 - $145,000",
        "recommended_certs": ["AWS Certified Developer", "Meta Front-End & Meta Back-End Professional"]
    },
    "Frontend Developer": {
        "core_skills": ["HTML / HTML5", "CSS / CSS3", "JavaScript", "React", "Git"],
        "secondary_skills": ["TypeScript", "Tailwind CSS", "Next.js", "Redux", "Figma", "Vite", "Unit Testing"],
        "description": "Focuses on crafting highly responsive, accessible, and performant web user experiences.",
        "demand_level": "High",
        "salary_range": "$80,000 - $130,000",
        "recommended_certs": ["Meta Front-End Developer Certificate"]
    },
    "Backend Engineer": {
        "core_skills": ["Python", "Java", "Node.js", "FastAPI", "REST APIs", "SQL", "Git"],
        "secondary_skills": ["PostgreSQL", "Redis", "Docker", "Microservices", "gRPC", "MongoDB", "CI/CD"],
        "description": "Designs high-throughput APIs, distributed systems, caching tiers, and relational data layers.",
        "demand_level": "Very High",
        "salary_range": "$95,000 - $155,000",
        "recommended_certs": ["AWS Solutions Architect", "Google Associate Cloud Engineer"]
    },
    "Data Scientist": {
        "core_skills": ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "Scikit-Learn"],
        "secondary_skills": ["Data Analysis", "Deep Learning", "PyTorch", "Tableau", "Power BI", "NLP", "Git"],
        "description": "Extracts actionable predictive insights and trains machine learning models on structured datasets.",
        "demand_level": "Very High",
        "salary_range": "$100,000 - $160,000",
        "recommended_certs": ["IBM Data Science Professional", "TensorFlow Developer Certificate"]
    },
    "Machine Learning Engineer": {
        "core_skills": ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", "Docker"],
        "secondary_skills": ["LLMs / Generative AI", "NLP", "Computer Vision", "Scikit-Learn", "Git", "REST APIs", "Kubernetes"],
        "description": "Deploys, scales, and fine-tunes production deep learning architectures and LLM pipelines.",
        "demand_level": "Very High",
        "salary_range": "$115,000 - $175,000",
        "recommended_certs": ["DeepLearning.AI Specialization", "AWS Certified Machine Learning - Specialty"]
    },
    "Cloud & DevOps Engineer": {
        "core_skills": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git"],
        "secondary_skills": ["Terraform", "GitHub Actions", "Azure", "GCP", "Nginx", "Prometheus", "Shell / Bash"],
        "description": "Automates deployment infrastructure, orchestrates containers, and guarantees system uptime.",
        "demand_level": "High",
        "salary_range": "$105,000 - $165,000",
        "recommended_certs": ["CKA (Certified Kubernetes Administrator)", "AWS Solutions Architect"]
    },
    "Data Analyst": {
        "core_skills": ["SQL", "Python", "Data Analysis", "Pandas", "Power BI"],
        "secondary_skills": ["Tableau", "NumPy", "Problem Solving", "Communication", "SQLite", "Git"],
        "description": "Analyzes business metrics, designs interactive BI dashboards, and informs corporate decisions.",
        "demand_level": "High",
        "salary_range": "$70,000 - $110,000",
        "recommended_certs": ["Google Data Analytics Professional Certificate"]
    },
    "Mobile App Developer": {
        "core_skills": ["JavaScript", "React", "Git", "REST APIs"],
        "secondary_skills": ["TypeScript", "Swift", "Kotlin", "Dart", "Firebase", "SQLite"],
        "description": "Builds intuitive mobile experiences across iOS and Android ecosystems.",
        "demand_level": "Steady",
        "salary_range": "$85,000 - $135,000",
        "recommended_certs": ["Google Associate Android Developer"]
    },
    "Cybersecurity Analyst": {
        "core_skills": ["Linux", "Shell / Bash", "Python", "Problem Solving"],
        "secondary_skills": ["Git", "Docker", "AWS", "Critical Thinking", "Communication"],
        "description": "Audits corporate networks, resolves vulnerabilities, and ensures regulatory compliance.",
        "demand_level": "Very High",
        "salary_range": "$85,000 - $140,000",
        "recommended_certs": ["CompTIA Security+", "Certified Ethical Hacker (CEH)"]
    },
    "QA & Automation Engineer": {
        "core_skills": ["Python", "Unit Testing", "Git", "REST APIs"],
        "secondary_skills": ["JavaScript", "Postman", "CI/CD", "Docker", "Agile / Scrum", "TDD"],
        "description": "Builds automated end-to-end test suites, prevents software regressions, and verifies API contracts.",
        "demand_level": "Steady",
        "salary_range": "$75,000 - $120,000",
        "recommended_certs": ["ISTQB Certified Tester"]
    }
}

def calculate_role_match(candidate_skills: List[str], role_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates match metrics between candidate skills and role specifications."""
    user_skills_set = set(candidate_skills)
    core = role_data["core_skills"]
    secondary = role_data["secondary_skills"]
    
    matched_core = [s for s in core if s in user_skills_set]
    missing_core = [s for s in core if s not in user_skills_set]
    
    matched_secondary = [s for s in secondary if s in user_skills_set]
    missing_secondary = [s for s in secondary if s not in user_skills_set]
    
    core_score = len(matched_core) / max(len(core), 1)
    sec_score = len(matched_secondary) / max(len(secondary), 1)
    
    # 70% core weight, 30% secondary weight
    match_pct = round((0.70 * core_score + 0.30 * sec_score) * 100)
    match_pct = max(10, min(98, match_pct))
    
    all_matched = sorted(list(set(matched_core + matched_secondary)))
    all_missing = sorted(list(set(missing_core + missing_secondary)))
    
    # Priority skills are missing core skills first, then missing secondary
    priority_skills = missing_core[:4] + [s for s in missing_secondary[:2] if s not in missing_core]
    
    # Generate tailored rationale
    if match_pct >= 75:
        rationale = f"Strong alignment! You already possess {len(matched_core)}/{len(core)} core competencies ({', '.join(matched_core[:3])})."
    elif match_pct >= 50:
        rationale = f"Promising match. You have foundational skills like {', '.join(matched_core[:2]) or 'basic tools'}, but need key skills like {', '.join(missing_core[:2])}."
    else:
        rationale = f"Emerging potential. Bridging key gaps in {', '.join(missing_core[:3])} will dramatically increase your match."

    return {
        "match_percentage": match_pct,
        "matched_skills": all_matched,
        "missing_skills": all_missing,
        "priority_skills": priority_skills,
        "rationale": rationale,
        "demand_level": role_data["demand_level"],
        "average_salary_range": role_data["salary_range"]
    }

def match_all_careers(candidate_skills: List[str]) -> List[Dict[str, Any]]:
    """Evaluates candidate against all preconfigured career tracks, sorted by match percentage."""
    results = []
    
    for role_title, role_data in CAREER_ROLES.items():
        match_info = calculate_role_match(candidate_skills, role_data)
        results.append({
            "role_title": role_title,
            "match_percentage": match_info["match_percentage"],
            "matched_skills": match_info["matched_skills"],
            "missing_skills": match_info["missing_skills"],
            "priority_skills": match_info["priority_skills"],
            "rationale": match_info["rationale"],
            "demand_level": match_info["demand_level"],
            "average_salary_range": match_info["average_salary_range"]
        })
        
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results

def get_skill_gap_for_role(role_title: str, candidate_skills: List[str]) -> Dict[str, Any]:
    """Generates an in-depth skill-gap breakdown for a designated target role."""
    # Find matching role or create custom heuristic
    matched_role_key = None
    for r in CAREER_ROLES.keys():
        if r.lower() == role_title.lower():
            matched_role_key = r
            break
            
    if not matched_role_key:
        # Default or fallback role if custom
        role_data = {
            "core_skills": ["Python", "SQL", "Git", "REST APIs"],
            "secondary_skills": ["Docker", "Linux", "Unit Testing", "Problem Solving"],
            "description": f"Role requirements mapped for {role_title}.",
            "demand_level": "High",
            "salary_range": "$80,000 - $130,000",
            "recommended_certs": ["Industry Standard Certification"]
        }
        role_title_formatted = role_title
    else:
        role_data = CAREER_ROLES[matched_role_key]
        role_title_formatted = matched_role_key
        
    match_info = calculate_role_match(candidate_skills, role_data)
    
    # Calculate simulated projected score if top 2 missing skills are acquired
    simulated_skills = candidate_skills + match_info["priority_skills"][:2]
    simulated_match = calculate_role_match(simulated_skills, role_data)["match_percentage"]
    
    return {
        "role_title": role_title_formatted,
        "match_percentage": match_info["match_percentage"],
        "projected_match_with_priorities": min(99, simulated_match),
        "matched_skills": match_info["matched_skills"],
        "missing_skills": match_info["missing_skills"],
        "priority_learning_order": match_info["priority_skills"],
        "recommended_certifications": role_data.get("recommended_certs", []),
        "role_description": role_data.get("description", "")
    }
