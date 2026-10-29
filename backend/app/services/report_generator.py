import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(analysis_dict: Dict[str, Any]) -> bytes:
    """
    Generates a beautifully styled, comprehensive PDF analysis report
    for the candidate using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom palette
    primary_color = colors.HexColor("#1e293b")   # Slate 800
    brand_blue = colors.HexColor("#3b82f6")      # Blue 500
    accent_purple = colors.HexColor("#6366f1")   # Indigo 500
    light_bg = colors.HexColor("#f8fafc")        # Slate 50
    border_color = colors.HexColor("#e2e8f0")    # Slate 200
    text_dark = colors.HexColor("#0f172a")       # Slate 900
    text_muted = colors.HexColor("#64748b")      # Slate 500

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=accent_purple,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_muted,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_dark
    )

    bold_label_style = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=text_dark
    )

    badge_score_style = ParagraphStyle(
        'ScoreBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        alignment=1, # Center
        textColor=accent_purple
    )

    badge_label_style = ParagraphStyle(
        'ScoreBadgeLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        alignment=1,
        textColor=text_muted
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=10,
        textColor=text_muted,
        spaceBefore=14
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("ResumeGenie — Resume Analysis & Career Recommendation Report", title_style))
    created_at_str = datetime.utcnow().strftime("%B %d, %Y")
    story.append(Paragraph(f"Generated on {created_at_str} | Verified with Deterministic & AI Multi-Heuristic Engine", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_blue, spaceBefore=0, spaceAfter=10))

    # 2. Candidate Overview & Overall Score Box
    candidate_name = analysis_dict.get("candidate_name") or "Candidate"
    filename = analysis_dict.get("filename") or "Resume"
    total_score = analysis_dict.get("total_score", 0)
    target_role = analysis_dict.get("target_role") or "General Tech Roles"
    
    contact = analysis_dict.get("extracted_data", {}).get("contact_info", {})
    email = contact.get("email") or "Not detected"
    phone = contact.get("phone") or "Not detected"

    meta_table_data = [
        [
            Paragraph(f"<b>Candidate:</b> {candidate_name}<br/><b>File:</b> {filename}<br/><b>Target Role:</b> {target_role}", body_style),
            Paragraph(f"<b>Email:</b> {email}<br/><b>Phone:</b> {phone}<br/><b>Format:</b> {analysis_dict.get('file_type', 'PDF').upper()}", body_style),
            [
                Paragraph(f"{total_score} / 100", badge_score_style),
                Paragraph("OVERALL SCORE", badge_label_style)
            ]
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[200, 200, 140])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 3. Score Breakdown Pillars Table
    story.append(Paragraph("Heuristic Scoring Pillars", h1_style))
    sb = analysis_dict.get("scores_breakdown", {})
    
    pillars = [
        ("Section Completeness", sb.get("section_completeness", {}).get("score", 0), 25, sb.get("section_completeness", {}).get("feedback", "")),
        ("Skills Depth & Breadth", sb.get("skills_depth", {}).get("score", 0), 25, sb.get("skills_depth", {}).get("feedback", "")),
        ("Action Verbs & Impact", sb.get("action_verbs_impact", {}).get("score", 0), 20, sb.get("action_verbs_impact", {}).get("feedback", "")),
        ("Formatting & Readability", sb.get("readability_structure", {}).get("score", 0), 15, sb.get("readability_structure", {}).get("feedback", "")),
        ("Experience & Projects", sb.get("experience_projects", {}).get("score", 0), 15, sb.get("experience_projects", {}).get("feedback", "")),
    ]

    breakdown_data = [
        [Paragraph("Pillar Dimension", bold_label_style), Paragraph("Score", bold_label_style), Paragraph("Diagnostic Feedback", bold_label_style)]
    ]
    for p_name, p_score, p_max, p_fb in pillars:
        breakdown_data.append([
            Paragraph(p_name, bold_label_style),
            Paragraph(f"<b>{p_score}</b> / {p_max}", body_style),
            Paragraph(p_fb, body_style)
        ])

    breakdown_table = Table(breakdown_data, colWidths=[140, 60, 340])
    breakdown_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e0e7ff")),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(breakdown_table)
    story.append(Spacer(1, 10))

    # 4. Top Matched Careers Table
    story.append(Paragraph("Top Career Role Recommendations", h1_style))
    matches = analysis_dict.get("career_matches", [])[:4]
    
    matches_data = [
        [Paragraph("Career Title", bold_label_style), Paragraph("Match %", bold_label_style), Paragraph("Matched Skills", bold_label_style), Paragraph("Key Skill Gaps", bold_label_style)]
    ]
    for m in matches:
        matched_str = ", ".join(m.get("matched_skills", [])[:4]) or "Foundational"
        missing_str = ", ".join(m.get("priority_skills", [])[:3]) or "None"
        matches_data.append([
            Paragraph(f"<b>{m.get('role_title')}</b>", bold_label_style),
            Paragraph(f"<b>{m.get('match_percentage')}%</b>", body_style),
            Paragraph(matched_str, body_style),
            Paragraph(missing_str, body_style)
        ])

    career_table = Table(matches_data, colWidths=[140, 60, 180, 160])
    career_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(career_table)
    story.append(Spacer(1, 10))

    # 5. Extracted Skills Summary
    story.append(Paragraph("Extracted Competencies & Tools", h1_style))
    skills_cat = analysis_dict.get("extracted_data", {}).get("skills_by_category", {})
    all_skills = analysis_dict.get("extracted_data", {}).get("all_skills", [])
    
    skill_rows = []
    for cat_key, cat_name in [
        ("programming_languages", "Languages"),
        ("frontend", "Frontend"),
        ("backend", "Backend"),
        ("databases", "Databases"),
        ("cloud_devops", "Cloud/DevOps"),
        ("ai_ml_data", "AI / Data"),
        ("tools_frameworks", "Tools & Frameworks"),
        ("soft_skills", "Soft Skills")
    ]:
        slist = skills_cat.get(cat_key, [])
        if slist:
            skill_rows.append([
                Paragraph(f"<b>{cat_name}</b>", bold_label_style),
                Paragraph(", ".join(slist), body_style)
            ])

    if skill_rows:
        skills_table = Table(skill_rows, colWidths=[130, 410])
        skills_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), light_bg),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(skills_table)
    else:
        story.append(Paragraph("Identified skills: " + (", ".join(all_skills) if all_skills else "None"), body_style))
    story.append(Spacer(1, 10))

    # 6. Strategic AI / Heuristic Insights & Bullet Rewrites
    ai_insights = analysis_dict.get("ai_insights", {})
    story.append(Paragraph("Strategic Executive Insights & Recommendations", h1_style))
    if ai_insights.get("executive_summary"):
        story.append(Paragraph(f"<b>Executive Summary:</b> {ai_insights.get('executive_summary')}", body_style))
        story.append(Spacer(1, 6))

    bullet_rewrites = ai_insights.get("bullet_rewrites", [])[:2]
    if bullet_rewrites:
        story.append(Paragraph("<b>Recommended STAR-Method Bullet Point Transformations:</b>", bold_label_style))
        for br in bullet_rewrites:
            story.append(Paragraph(f"• <i>Before:</i> {br.get('original_theme')}", body_style))
            story.append(Paragraph(f"  <b>After (STAR):</b> {br.get('improved_star_bullet')}", body_style))
            story.append(Spacer(1, 4))

    # 7. Priority Project Blueprints
    projects = analysis_dict.get("suggestions", {}).get("project_recommendations", [])[:2]
    if projects:
        story.append(Paragraph("Priority Portfolio Project Recommendations", h1_style))
        for proj in projects:
            skills_covered_str = ", ".join(proj.get("skills_covered", []))
            story.append(Paragraph(f"• <b>{proj.get('title')}</b> ({proj.get('difficulty')})", bold_label_style))
            story.append(Paragraph(f"  {proj.get('description')} <i>[Skills: {skills_covered_str}]</i>", body_style))
            story.append(Spacer(1, 4))

    # Disclaimer
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=8, spaceAfter=6))
    story.append(Paragraph(
        "Disclaimer: This report was compiled by ResumeGenie for academic and personal career guidance. "
        "Scores are computed via transparent heuristics and do not guarantee official applicant tracking system (ATS) "
        "filtering or specific recruitment outcomes.",
        disclaimer_style
    ))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
