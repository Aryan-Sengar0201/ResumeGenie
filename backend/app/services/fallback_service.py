from typing import List, Dict, Any

def generate_deterministic_insights(
    candidate_name: str,
    total_score: int,
    all_skills: List[str],
    top_career: str,
    missing_skills: List[str],
    weaknesses: List[str]
) -> Dict[str, Any]:
    """
    Generates intelligent, deterministic fallback recommendations, bullet rewrites,
    and interview prep questions when Gemini API key is absent or unavailable.
    """
    skills_sample = ", ".join(all_skills[:4]) if all_skills else "core development skills"
    top_missing_1 = missing_skills[0] if missing_skills else "Cloud Architecture"
    top_missing_2 = missing_skills[1] if len(missing_skills) > 1 else "CI/CD Pipelines"

    # Executive summary
    if total_score >= 80:
        summary = (
            f"{candidate_name}'s resume presents a compelling profile with strong technical grounding in {skills_sample}. "
            f"The candidate is well-positioned for roles such as {top_career}. To reach senior-level consideration, "
            f"focus on demonstrating system architectural decisions and quantified business impact in recent deliverables."
        )
    elif total_score >= 60:
        summary = (
            f"{candidate_name} demonstrates good foundational engineering proficiencies across {skills_sample}. "
            f"Strong potential is evident for {top_career} tracks. Enhancing project narratives with metrics "
            f"and addressing key skills such as {top_missing_1} and {top_missing_2} will significantly increase interview conversion."
        )
    else:
        summary = (
            f"{candidate_name}'s resume has solid academic or technical foundations but requires structural refinement. "
            f"Highlighting concrete projects that showcase {skills_sample}, expanding action verbs, and adding "
            f"metrics will transform this into an interview-winning resume for {top_career} roles."
        )

    # Bullet rewrites using STAR (Situation, Task, Action, Result) methodology
    bullet_rewrites = [
        {
            "original_theme": "Generic responsibility: 'Worked on web application frontend using modern technologies'",
            "improved_star_bullet": (
                f"Engineered responsive user interfaces utilizing {all_skills[0] if all_skills else 'React'} "
                f"and modern component architectures, improving Lighthouse performance score by 28% and boosting user retention."
            ),
            "impact_explanation": "Replaces passive duty phrasing with an active verb ('Engineered') and quantifiable user experience metric."
        },
        {
            "original_theme": "Generic responsibility: 'Assisted in database management and backend APIs'",
            "improved_star_bullet": (
                f"Architected {min(len(all_skills), 8)}+ RESTful endpoints in {all_skills[1] if len(all_skills) > 1 else 'Python/Node.js'} "
                f"with automated input validation, cutting p95 query latency by 35% across 5,000+ daily requests."
            ),
            "impact_explanation": "Emphasizes technical scale (5,000+ daily requests) and specific engineering metrics (p95 latency reduction)."
        },
        {
            "original_theme": "Generic responsibility: 'Tested software and fixed bugs before release'",
            "improved_star_bullet": (
                "Implemented automated integration test suites and CI pipeline checks, decreasing pre-deployment regression defects by 42%."
            ),
            "impact_explanation": "Frames bug fixing into a proactive quality engineering achievement with measurable defect reduction."
        }
    ]

    # Interview prep questions tailored to their stack
    first_skill = all_skills[0] if all_skills else "Python"
    second_skill = all_skills[1] if len(all_skills) > 1 else "SQL"
    interview_questions = [
        f"Deep Dive: How do you design, optimize, and maintain concurrency or asynchronous tasks in {first_skill} when scaling to high loads?",
        f"Database & Data Integrity: Explain how you would structure indexing, transactions, and migration strategies when querying {second_skill} in production.",
        f"System Design & Tradeoffs: For a target role in {top_career}, describe how you would bridge the integration between {first_skill} and {top_missing_1} while ensuring fault tolerance."
    ]

    # Project blueprints designed to bridge skill gaps
    project_recommendations = [
        {
            "title": f"Enterprise {top_career} Analytics Engine",
            "description": f"Build a production-grade microservice pipeline that ingests live telemetry, stores data in modern databases, and showcases {top_missing_1}.",
            "skills_covered": [top_missing_1, first_skill, "REST APIs", "Docker"],
            "difficulty": "Intermediate"
        },
        {
            "title": f"Automated CI/CD & Cloud Infrastructure Provisioner",
            "description": f"Develop an automated infrastructure-as-code deployment pipeline with monitoring alerts, containerization, and test automation for {top_missing_2}.",
            "skills_covered": [top_missing_2, "Docker", "Git", "Linux"],
            "difficulty": "Advanced"
        },
        {
            "title": "Full-Stack Collaborative Workspace with Realtime Sync",
            "description": f"Develop a collaborative dashboard demonstrating asynchronous events, secure auth, and clean component isolation.",
            "skills_covered": [first_skill, second_skill, "WebSockets / REST", "Unit Testing"],
            "difficulty": "Intermediate"
        }
    ]

    # Learning roadmaps
    learning_roadmaps = [
        {
            "skill": top_missing_1,
            "estimated_weeks": 3,
            "steps": [
                f"Week 1: Core fundamentals and architecture syntax of {top_missing_1}",
                f"Week 2: Build a self-contained prototype integrating {top_missing_1} with {first_skill}",
                "Week 3: Production hardening: write unit tests, Dockerize, and document in GitHub README"
            ]
        },
        {
            "skill": top_missing_2,
            "estimated_weeks": 2,
            "steps": [
                f"Week 1: Hands-on setup and local configuration of {top_missing_2}",
                f"Week 2: Deploy an automated workflow connecting your repository to a cloud runtime"
            ]
        }
    ]

    # Content improvements and quick wins
    content_improvements = [
        "Upgrade bullet points using the Google 'XYZ Formula': Accomplished [X] as measured by [Y], by doing [Z].",
        f"Create a dedicated 'Key Technical Projects' section showcasing {first_skill} and {top_missing_1} with live demo links.",
        "Ensure every job or internship entry lists 3-4 bullet points highlighting individual contributions rather than team tasks."
    ]

    quick_wins = [
        "Include active GitHub repository links and live deployed application URLs.",
        "Standardize date formatting (e.g., 'May 2024 – Present') for ATS parseability.",
        "Remove generic personal pronouns ('I', 'me', 'my') from project descriptions."
    ]

    return {
        "is_ai_generated": False,
        "provider": "ResumeGenie Deterministic Heuristic Engine",
        "executive_summary": summary,
        "bullet_rewrites": bullet_rewrites,
        "interview_questions": interview_questions,
        "custom_career_advice": (
            f"Prioritize building 1 flagship open-source project combining {first_skill} with {top_missing_1}. "
            "Showcasing quantifiable metrics on your GitHub repo is the single highest leverage step for your next application cycle."
        ),
        "project_recommendations": project_recommendations,
        "learning_roadmaps": learning_roadmaps,
        "content_improvements": content_improvements,
        "quick_wins": quick_wins
    }
