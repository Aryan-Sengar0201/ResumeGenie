import re
from typing import Dict, List, Set, Tuple

# Comprehensive taxonomy of skills mapped to standardized canonical names
SKILL_TAXONOMY = {
    "programming_languages": {
        "Python": [r"\bpython(?:3)?\b"],
        "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b"],
        "TypeScript": [r"\btypescript\b", r"\bts\b"],
        "Java": [r"\bjava\b(?!\s*script)"],
        "C++": [r"\bc\+\+\b", r"\bcpp\b"],
        "C#": [r"\bc#\b", r"\bcsharp\b"],
        "C": [r"(?<![a-zA-Z0-9_])C(?![a-zA-Z0-9_#+])"],
        "Go": [r"\bgolang\b", r"(?<![a-zA-Z0-9_])Go(?![a-zA-Z0-9_])"],
        "Rust": [r"\brust\b"],
        "PHP": [r"\bphp\b"],
        "Ruby": [r"\bruby\b"],
        "Swift": [r"\bswift\b"],
        "Kotlin": [r"\bkotlin\b"],
        "SQL": [r"\bsql\b"],
        "R": [r"(?<![a-zA-Z0-9_])R(?![a-zA-Z0-9_])"],
        "Dart": [r"\bdart\b"],
        "Scala": [r"\bscala\b"],
        "Shell / Bash": [r"\bbash\b", r"\bshell\s+script(?:ing)?\b", r"\bpowershell\b"]
    },
    "frontend": {
        "React": [r"\breact(?:\.js)?\b"],
        "Next.js": [r"\bnext(?:\.js)?\b"],
        "Angular": [r"\bangular(?:\.js)?\b"],
        "Vue.js": [r"\bvue(?:\.js)?\b"],
        "HTML / HTML5": [r"\bhtml5?\b"],
        "CSS / CSS3": [r"\bcss3?\b"],
        "Tailwind CSS": [r"\btailwind(?:\s*css)?\b"],
        "Bootstrap": [r"\bbootstrap\b"],
        "Redux": [r"\bredux\b"],
        "Svelte": [r"\bsvelte\b"],
        "Sass / SCSS": [r"\bsass\b", r"\bscss\b"],
        "Webpack": [r"\bwebpack\b"],
        "Vite": [r"\bvite\b"],
        "jQuery": [r"\bjquery\b"]
    },
    "backend": {
        "Node.js": [r"\bnode(?:\.js)?\b"],
        "Express": [r"\bexpress(?:\.js)?\b"],
        "FastAPI": [r"\bfastapi\b"],
        "Django": [r"\bdjango\b"],
        "Flask": [r"\bflask\b"],
        "Spring Boot": [r"\bspring\s*boot\b", r"\bspring\s*framework\b"],
        "ASP.NET": [r"\basp\.net\b", r"\b\.net\s*core\b"],
        "NestJS": [r"\bnest(?:\.js)?\b"],
        "Ruby on Rails": [r"\bruby\s+on\s+rails\b", r"\brails\b"],
        "GraphQL": [r"\bgraphql\b"],
        "REST APIs": [r"\brest(?:ful)?\s*api(?:s)?\b", r"\brest\b"],
        "gRPC": [r"\bgrpc\b"],
        "Microservices": [r"\bmicroservices?\b"]
    },
    "databases": {
        "PostgreSQL": [r"\bpostgres(?:ql)?\b"],
        "MySQL": [r"\bmysql\b"],
        "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
        "Redis": [r"\bredis\b"],
        "SQLite": [r"\bsqlite\b"],
        "Firebase": [r"\bfirebase\b", r"\bfirestore\b"],
        "Supabase": [r"\bsupabase\b"],
        "Oracle DB": [r"\boracle\s*(?:database|db)?\b"],
        "Cassandra": [r"\bcassandra\b"],
        "DynamoDB": [r"\bdynamodb\b"],
        "Elasticsearch": [r"\belasticsearch\b"],
        "Prisma": [r"\bprisma\b"]
    },
    "cloud_devops": {
        "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b"],
        "Docker": [r"\bdocker\b"],
        "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
        "CI/CD": [r"\bci\/?cd\b", r"\bcontinuous\s+integration\b"],
        "GitHub Actions": [r"\bgithub\s*actions\b"],
        "Terraform": [r"\bterraform\b"],
        "Azure": [r"\bazure\b"],
        "GCP": [r"\bgcp\b", r"\bgoogle\s+cloud(?:\s+platform)?\b"],
        "Linux": [r"\blinux\b", r"\bubuntu\b", r"\bdebian\b"],
        "Nginx": [r"\bnginx\b"],
        "Ansible": [r"\bansible\b"],
        "Jenkins": [r"\bjenkins\b"],
        "Prometheus": [r"\bprometheus\b"],
        "Grafana": [r"\bgrafana\b"]
    },
    "ai_ml_data": {
        "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b"],
        "Deep Learning": [r"\bdeep\s+learning\b"],
        "PyTorch": [r"\bpytorch\b"],
        "TensorFlow": [r"\btensorflow\b"],
        "Scikit-Learn": [r"\bscikit-learn\b", r"\bsklearn\b"],
        "Pandas": [r"\bpandas\b"],
        "NumPy": [r"\bnumpy\b"],
        "Data Analysis": [r"\bdata\s+analysis\b", r"\bdata\s+analytics\b"],
        "NLP": [r"\bnlp\b", r"\bnatural\s+language\s+processing\b"],
        "Computer Vision": [r"\bcomputer\s+vision\b", r"\bopencv\b"],
        "LLMs / Generative AI": [r"\bllm(?:s)?\b", r"\blarge\s+language\s+models?\b", r"\bgenerative\s+ai\b", r"\bgemini\b", r"\bgpt\b"],
        "LangChain": [r"\blangchain\b"],
        "Hugging Face": [r"\bhugging\s*face\b"],
        "Tableau": [r"\btableau\b"],
        "Power BI": [r"\bpower\s*bi\b"]
    },
    "tools_frameworks": {
        "Git": [r"\bgit\b(?!\s*hub|\s*lab)"],
        "GitHub": [r"\bgithub\b"],
        "GitLab": [r"\bgitlab\b"],
        "Postman": [r"\bpostman\b"],
        "Jira": [r"\bjira\b"],
        "Agile / Scrum": [r"\bagile\b", r"\bscrum\b"],
        "Figma": [r"\bfigma\b"],
        "Unit Testing": [r"\bunit\s*test(?:ing)?\b", r"\bpytest\b", r"\bjest\b", r"\bjunit\b"],
        "TDD": [r"\btdd\b", r"\btest\s+driven\s+development\b"]
    },
    "soft_skills": {
        "Problem Solving": [r"\bproblem\s+solving\b", r"\banalytical\s+skills?\b"],
        "Communication": [r"\bcommunication\b", r"\binterpersonal\s+skills?\b"],
        "Team Leadership": [r"\bleadership\b", r"\bteam\s+lead\b", r"\bmentor(?:ship)?\b"],
        "Teamwork / Collaboration": [r"\bteamwork\b", r"\bcollaboration\b", r"\bcross-functional\b"],
        "Time Management": [r"\btime\s+management\b"],
        "Adaptability": [r"\badaptability\b", r"\bflexibility\b"],
        "Critical Thinking": [r"\bcritical\s+thinking\b"],
        "Project Management": [r"\bproject\s+management\b"]
    }
}

def extract_skills(text: str) -> Tuple[Dict[str, List[str]], List[str]]:
    """
    Extracts and categorizes skills from resume text.
    Returns:
      (categorized_skills_dict, flat_unique_skills_list)
    """
    categorized: Dict[str, List[str]] = {cat: [] for cat in SKILL_TAXONOMY.keys()}
    all_found_skills: Set[str] = set()

    for category, skills in SKILL_TAXONOMY.items():
        for canonical_name, patterns in skills.items():
            matched = False
            for pat in patterns:
                # Case sensitivity check for single letter/short acronyms
                flags = 0 if pat.startswith("(?<![a-zA-Z0-9_])") else re.IGNORECASE
                if re.search(pat, text, flags):
                    matched = True
                    break
            if matched:
                categorized[category].append(canonical_name)
                all_found_skills.add(canonical_name)

    # Sort each category alphabetically
    for cat in categorized:
        categorized[cat] = sorted(categorized[cat])

    return categorized, sorted(list(all_found_skills))
