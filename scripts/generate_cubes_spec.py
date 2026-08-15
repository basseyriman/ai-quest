import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_cubes_spec():
    base_dir = "c:\\Users\\basse\\Documents\\RimanTech\\AI QUEST GAME\\ai-quest"
    production_dir = os.path.join(base_dir, "production_artwork")
    output_path = os.path.join(production_dir, "07_wood_cubes_specification.pdf")
    
    # 1. Page Setup
    doc = SimpleDocTemplate(output_path, pagesize=letter,
                            rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#64748b'),
        alignment=1
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )
    
    story.append(Paragraph("WOODEN CUBES SPECIFICATION", title_style))
    story.append(Paragraph("AI QUEST — PROTOTYPE ORDER COMPONENT", subtitle_style))
    story.append(Spacer(1, 24))
    
    intro_text = (
        "As confirmed with the Project Manager, the wooden cubes do not require "
        "custom printing. This document specifies the quantity and standard colors for the "
        "8mm wooden cubes included in this order."
    )
    story.append(Paragraph(intro_text, body_style))
    story.append(Spacer(1, 20))
    
    # 2. Table Data
    data = [
        [Paragraph("<b>Color</b>", body_style), Paragraph("<b>Standard Color Code (Hex/Ref)</b>", body_style), Paragraph("<b>Quantity per Unit</b>", body_style)],
        [Paragraph("Purple", body_style), Paragraph("#8B5CF6 / Violet-500 Standard", body_style), Paragraph("2 cubes", body_style)],
        [Paragraph("Blue", body_style), Paragraph("#3B82F6 / Blue-500 Standard", body_style), Paragraph("2 cubes", body_style)],
        [Paragraph("Red", body_style), Paragraph("#EF4444 / Red-500 Standard", body_style), Paragraph("2 cubes", body_style)],
        [Paragraph("Green", body_style), Paragraph("#10B981 / Emerald-500 Standard", body_style), Paragraph("2 cubes", body_style)],
        [Paragraph("<b>Total per Unit</b>", body_style), Paragraph("—", body_style), Paragraph("<b>8 cubes total</b>", body_style)]
    ]
    
    # Table layout
    table = Table(data, colWidths=[150, 200, 150])
    
    # Color indicators
    purple_box = colors.HexColor('#8B5CF6')
    blue_box = colors.HexColor('#3B82F6')
    red_box = colors.HexColor('#EF4444')
    green_box = colors.HexColor('#10B981')
    
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (2, 0), colors.HexColor('#f1f5f9')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        
        # Color coding for rows
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0, 2), (0, 2), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0, 3), (0, 3), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0, 4), (0, 4), colors.HexColor('#f8fafc')),
        
        # Bold total row
        ('BACKGROUND', (0, 5), (2, 5), colors.HexColor('#f8fafc')),
    ]))
    
    story.append(table)
    story.append(Spacer(1, 30))
    
    footer_text = (
        "<b>Note for Production Specialist:</b> Please supply solid-colored 8mm wooden cubes "
        "matching these standard colors. No custom printing or engraving is required for these cubes."
    )
    story.append(Paragraph(footer_text, body_style))
    
    # Build Document
    doc.build(story)
    print(f"Saved cubes spec PDF to {output_path}")

if __name__ == "__main__":
    generate_cubes_spec()
