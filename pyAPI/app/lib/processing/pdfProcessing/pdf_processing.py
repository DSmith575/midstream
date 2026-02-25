from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, PageBreak
import os
import pymupdf
import json
import re
from datetime import datetime
from fastapi.responses import StreamingResponse
from io import BytesIO
from app.lib.utils.color_mapping import (
    highlight_keywords_in_text, 
    get_category_color_object,
    detect_categories_in_text
)

def generate_pdf_with_audio_transcript(paragraphs: list[str], filename: str) -> BytesIO:
    """
    Generate a professional PDF from audio transcription paragraphs.
    
    Args:
        paragraphs: List of paragraph strings from transcription
        filename: Base filename for the document
    
    Returns:
        BytesIO buffer containing the PDF data
    """
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(
        pdf_buffer, 
        pagesize=A4,
        rightMargin=0.75*inch, 
        leftMargin=0.75*inch,
        topMargin=0.75*inch, 
        bottomMargin=0.75*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Define custom styles for professional appearance
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=colors.HexColor('#1a202c'),
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#2d3748'),
        spaceAfter=12,
        alignment=4  # JUSTIFY
    )
    
    metadata_style = ParagraphStyle(
        'Metadata',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#718096'),
        spaceAfter=4
    )
    
    story = []
    
    # Add professional header
    story.append(Paragraph(f"Audio Transcription Report", title_style))
    story.append(Spacer(1, 6))
    
    # Add metadata
    story.append(Paragraph(
        f"<b>Document:</b> {filename}", 
        metadata_style
    ))
    story.append(Paragraph(
        f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", 
        metadata_style
    ))
    story.append(Spacer(1, 18))
    
    # Add transcription content with better formatting
    for i, paragraph in enumerate(paragraphs, 1):
        # Add paragraph with professional styling
        story.append(Paragraph(paragraph, body_style))
        
        # Add page break every 6 paragraphs to avoid crowded pages
        if i % 6 == 0 and i < len(paragraphs):
            story.append(PageBreak())
    
    doc.build(story)
    pdf_buffer.seek(0)
    pdf_buffer.name = f"{filename}.pdf"
    return pdf_buffer

def generate_full_referral_form(metadata: dict, extracted_ai_text: dict):
    pdf_buffer = BytesIO()
    
    # Create a template with header and footer support
    class NumberedCanvas:
        def __init__(self, *args, **kwargs):
            self.page_number = 0
    
    doc = SimpleDocTemplate(
        pdf_buffer, 
        pagesize=A4,
        rightMargin=0.8*inch, 
        leftMargin=0.8*inch,
        topMargin=1.0*inch, 
        bottomMargin=0.8*inch,
        title="Client Referral Form",
        creator="Midstream"
    )
    
    styles = getSampleStyleSheet()
    
    # Professional color scheme - refined
    primary_color = colors.HexColor('#1e40af')  # Professional blue
    heading_color = colors.HexColor('#0f172a')  # Almost black
    accent_color = colors.HexColor('#0369a1')   # Lighter blue
    text_color = colors.HexColor('#1e293b')     # Dark slate
    light_text = colors.HexColor('#475569')     # Medium slate
    meta_color = colors.HexColor('#64748b')     # Light slate
    border_color = colors.HexColor('#cbd5e1')   # Very light slate
    
    # Custom styles with professional typography
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=32,
        textColor=heading_color,
        spaceAfter=6,
        spaceBefore=0,
        fontName='Helvetica-Bold',
        alignment=0,  # LEFT for professional look
        leading=38
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=18,
        textColor=primary_color,
        spaceAfter=2,
        fontName='Helvetica-Bold',
        alignment=0
    )
    
    metadata_header_style = ParagraphStyle(
        'MetadataHeader',
        parent=styles['Normal'],
        fontSize=9,
        textColor=meta_color,
        spaceAfter=10,
        fontName='Helvetica',
        alignment=0,
        leading=11
    )
    
    section_heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.white,
        spaceAfter=6,
        spaceBefore=12,
        fontName='Helvetica-Bold',
        borderWidth=1,
        borderColor=primary_color,
        borderPadding=8,
        backColor=primary_color,
        borderRadius=4
    )
    
    subsection_heading_style = ParagraphStyle(
        'SubsectionHeading',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=heading_color,
        spaceAfter=3,
        spaceBefore=6,
        fontName='Helvetica-Bold',
        borderBottomWidth=2,
        borderBottomColor=accent_color,
        borderBottomStyle='solid',
        paddingBottom=4
    )

    assessment_subsection_palette = [
        colors.HexColor('#0f766e'),
        colors.HexColor('#1e40af'),
        colors.HexColor('#7c3aed'),
        colors.HexColor('#be123c'),
        colors.HexColor('#b45309'),
        colors.HexColor('#15803d')
    ]

    def get_colored_subsection_style(color, index):
        return ParagraphStyle(
            f'AssessmentSubsection_{index}',
            parent=subsection_heading_style,
            backColor=color,
            textColor=colors.white,
            fontName='Helvetica-Bold',
            fontSize=11,
            borderWidth=0,
            borderPadding=6,
            spaceBefore=12,
            spaceAfter=6
        )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        leading=15,
        textColor=text_color,
        spaceAfter=3,
        alignment=4,  # JUSTIFY for professional appearance
        leftIndent=0,
        rightIndent=0
    )
    
    metadata_style = ParagraphStyle(
        'Metadata',
        parent=styles['Normal'],
        fontSize=9,
        textColor=meta_color,
        spaceAfter=3,
        fontName='Helvetica',
        leading=11
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['BodyText'],
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=3,
        leftIndent=20,
        rightIndent=0
    )
    
    info_row_style = ParagraphStyle(
        'InfoRow',
        parent=styles['Normal'],
        fontSize=10,
        textColor=text_color,
        spaceAfter=6,
        leading=13
    )

    story = []
    
    # ============= PROFESSIONAL HEADER =============
    
    # Title and client name
    story.append(Paragraph("CLIENT REFERRAL FORM", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        f"{metadata.get('firstName', '')} {metadata.get('lastName', '')}", 
        subtitle_style
    ))
    story.append(Spacer(1, 10))
    
    # Metadata bar
    generated_date = datetime.now().strftime('%B %d, %Y')
    generated_time = datetime.now().strftime('%I:%M %p')
    metadata_text = f"<b>Generated:</b> {generated_date} | <b>Time:</b> {generated_time}"
    story.append(Paragraph(metadata_text, metadata_header_style))
    
    # Professional divider
    from reportlab.platypus import HRFlowable
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=4, spaceAfter=12))

    story.append(Spacer(1, 8))
    
    # Add color coding explanation - professional note
    story.append(Paragraph(
        "<i>Visual Mapping: Keywords are color-coded by assessment category throughout this document for consistent cross-referencing between clinical notes and recommendations.</i>",
        metadata_style
    ))
    story.append(Spacer(1, 10))

    # ============= CLIENT INFORMATION SECTION =============
    story.append(Paragraph("Client Information", section_heading_style))
    story.append(Spacer(1, 10))

    def format_label(text: str) -> str:
        if not text:
            return ''
        spaced = re.sub(r'(?<!^)([A-Z])', r' \1', str(text))
        spaced = spaced.replace('_', ' ')
        return spaced.title().strip()

    def format_value(value):
        """Format value: convert True to 'Yes', False to 'No', handle None"""
        if value is None:
            return None
        if isinstance(value, bool):
            return "Yes" if value is True else "No"
        return str(value)

    def render_section_items(section_name, content, story_items):
        """Render a section with its items, converting booleans to Yes/No"""
        if not isinstance(content, dict):
            return
        
        items = []
        for key, value in content.items():
            if key == 'id' or value is None:
                continue
            
            formatted_value = format_value(value)
            if formatted_value is None:  # Skip only truly None values
                continue
            
            label = format_label(key)
            items.append(
                ListItem(Paragraph(f"<b>{label}:</b> {formatted_value}", bullet_style))
            )
        
        if items:
            story_items.append(ListItem(Paragraph(f"<b>{section_name}</b>", bullet_style)))
            story_items.extend(items)

    # Special handling for Communication, Disability, and Additional Information sections
    sections_to_skip = ['documents', 'notes', 'pdf_summary', 'support_keywords', 'goals', '_category_mapping', 'communication', 'disability', 'additionalInformation', 'firstName', 'lastName', 'middleName', 'id', 'createdAt', 'updatedAt']
    
    # Render Communication section
    if 'communication' in metadata and metadata['communication']:
        story.append(Paragraph("Communication", subsection_heading_style))
        story.append(Spacer(1, 6))
        comm_items = []
        render_section_items("", metadata['communication'], comm_items)
        if comm_items:
            story.append(ListFlowable(
                comm_items,
                bulletType='bullet',
                leftIndent=12,
                bulletFontSize=7,
                bulletColor=primary_color
            ))
        story.append(Spacer(1, 6))

    # Render Disability section
    if 'disability' in metadata and metadata['disability']:
        story.append(Paragraph("Disability", subsection_heading_style))
        story.append(Spacer(1, 6))
        disability_items = []
        render_section_items("", metadata['disability'], disability_items)
        if disability_items:
            story.append(ListFlowable(
                disability_items,
                bulletType='bullet',
                leftIndent=12,
                bulletFontSize=7,
                bulletColor=primary_color
            ))
        story.append(Spacer(1, 6))

    # Render Additional Information section
    if 'additionalInformation' in metadata and metadata['additionalInformation']:
        story.append(Paragraph("Additional Information", subsection_heading_style))
        story.append(Spacer(1, 6))
        additional_items = []
        render_section_items("", metadata['additionalInformation'], additional_items)
        if additional_items:
            story.append(ListFlowable(
                additional_items,
                bulletType='bullet',
                leftIndent=12,
                bulletFontSize=7,
                bulletColor=primary_color
            ))
        story.append(Spacer(1, 6))

    # Render other sections (excluding the ones we've handled specifically)
    bullet_items = []
    for section, content in metadata.items():
        if not isinstance(content, dict) or section in sections_to_skip:
            continue
        
        section_title = format_label(section)
        render_section_items(section_title, content, bullet_items)

    if bullet_items:
        story.append(ListFlowable(
            bullet_items,
            bulletType='bullet',
            leftIndent=12,
            bulletFontSize=7,
            bulletColor=primary_color
        ))
    
    story.append(Spacer(1, 8))

    # ============= GOALS & ASPIRATIONS SECTION =============
    if 'goals' in metadata and metadata['goals']:
        story.append(Paragraph("Goals & Aspirations", section_heading_style))
        story.append(Spacer(1, 8))
        goals_data = metadata['goals']
        if isinstance(goals_data, dict):
            if 'whanauGoal' in goals_data and goals_data['whanauGoal']:
                story.append(Paragraph("<b>Whanau/Person Goal:</b>", subsection_heading_style))
                story.append(Paragraph(goals_data['whanauGoal'], body_style))
                story.append(Spacer(1, 6))
            if 'aspiration' in goals_data and goals_data['aspiration']:
                story.append(Paragraph("<b>Aspiration:</b>", subsection_heading_style))
                story.append(Paragraph(goals_data['aspiration'], body_style))
                story.append(Spacer(1, 6))
            if 'biggestBarrier' in goals_data and goals_data['biggestBarrier']:
                story.append(Paragraph("<b>Biggest Barrier:</b>", subsection_heading_style))
                story.append(Paragraph(goals_data['biggestBarrier'], body_style))

    # ============= CLINICAL NOTES SECTION =============
    if 'notes' in metadata and metadata['notes']:
        story.append(Paragraph("Clinical Notes", section_heading_style))
        story.append(Spacer(1, 6))
        for i, note in enumerate(metadata['notes'], 1):
            if isinstance(note, dict) and 'content' in note:
                story.append(Paragraph(f"Note {i}", subsection_heading_style))
                note_content = note['content']
                # Apply keyword highlighting to note content
                detected_categories = detect_categories_in_text(note_content)
                if detected_categories:
                    note_content = highlight_keywords_in_text(note_content, list(detected_categories))
                story.append(Paragraph(note_content, body_style))
                
                # Add timestamp if available
                if 'createdAt' in note and note['createdAt']:
                    try:
                        # Parse the timestamp and format it nicely
                        if isinstance(note['createdAt'], str):
                            timestamp = datetime.fromisoformat(note['createdAt'].replace('Z', '+00:00'))
                        else:
                            timestamp = note['createdAt']
                        formatted_date = timestamp.strftime('%B %d, %Y at %I:%M %p')
                        story.append(Paragraph(f"<i>Created: {formatted_date}</i>", metadata_style))
                    except (ValueError, AttributeError):
                        # If timestamp parsing fails, just skip it
                        pass
                
    # ============= ASSESSMENT SUMMARY SECTION =============
    # story.append(PageBreak())
    story.append(Paragraph("Assessment Summary", section_heading_style))
    story.append(Spacer(1, 8))

    # Extract category mapping if available
    category_mapping = extracted_ai_text.get('_category_mapping', {})
    
    for idx, (section, items) in enumerate(extracted_ai_text.items()):
        # Skip the internal category mapping
        if section == '_category_mapping':
            continue
            
        section_title = format_label(section)
        
        # Use category color if section matches a category, otherwise use palette
        section_color = get_category_color_object(section)
        if section_color == colors.HexColor('#64748b'):  # Default color means no match
            section_color = assessment_subsection_palette[idx % len(assessment_subsection_palette)]
        else:
            section_color = section_color
        
        story.append(Paragraph(
            section_title,
            get_colored_subsection_style(section_color, idx)
        ))
        story.append(Spacer(1, 6))

        for item, response in items.items():
            item_label = format_label(item)
            story.append(Paragraph(f"<b>{item_label}</b>", bullet_style))
            
            response_text = str(response) if response else "No relevant information found."
            
            # Highlight keywords in the response text based on detected categories
            detected_categories = detect_categories_in_text(response_text)
            if detected_categories:
                response_text = highlight_keywords_in_text(response_text, list(detected_categories))
            
            story.append(Paragraph(response_text, body_style))
            story.append(Spacer(1, 4))

    # story.append(PageBreak())

    # --- PDF Summary Section ---
    if 'pdf_summary' in metadata and metadata['pdf_summary']:
        story.append(Paragraph("Overall Assessment Summary", section_heading_style))
        story.append(Spacer(1, 6))

        def stringify_summary_value(value):
            if isinstance(value, dict):
                parts = []
                for key, inner_value in value.items():
                    label = str(key).replace('_', ' ').title()
                    inner_text = stringify_summary_value(inner_value)
                    if inner_text:
                        parts.append(f"{label}: {inner_text}")
                return "; ".join(parts)
            if isinstance(value, list):
                return "; ".join([str(item) for item in value if item])
            if value is None:
                return ""
            return str(value)

        def normalize_pdf_summary(summary_value):
            if isinstance(summary_value, dict):
                if isinstance(summary_value.get('paragraphs'), list):
                    return [p for p in summary_value['paragraphs'] if p]
                if 'summary' in summary_value:
                    return normalize_pdf_summary(summary_value['summary'])
                paragraphs = []
                for key, value in summary_value.items():
                    label = str(key).replace('_', ' ').title()
                    text = stringify_summary_value(value)
                    if text:
                        paragraphs.append(f"{label}: {text}")
                return paragraphs
            if isinstance(summary_value, list):
                return [str(item) for item in summary_value if item]
            if isinstance(summary_value, str):
                stripped = summary_value.strip()
                if stripped.startswith('{') or stripped.startswith('['):
                    try:
                        parsed = json.loads(stripped)
                        return normalize_pdf_summary(parsed)
                    except json.JSONDecodeError:
                        return [summary_value]
                return [summary_value]
            return [str(summary_value)]

        summary_paragraphs = normalize_pdf_summary(metadata['pdf_summary'])
        for i, paragraph in enumerate(summary_paragraphs):
            # Apply keyword highlighting to summary text
            detected_categories = detect_categories_in_text(paragraph)
            if detected_categories:
                paragraph = highlight_keywords_in_text(paragraph, list(detected_categories))
            story.append(Paragraph(paragraph, body_style))
            if i < len(summary_paragraphs) - 1:
                story.append(Spacer(1, 8))

        story.append(Spacer(1, 12))

    # --- Support Keywords Section ---
    if 'support_keywords' in metadata and metadata['support_keywords']:
        story.append(Paragraph("Recommended Areas of Support", section_heading_style))
        story.append(Spacer(1, 10))
        
        support_data = metadata['support_keywords']
        if isinstance(support_data, dict) and 'primary_needs' in support_data:
            primary_needs = support_data.get('primary_needs', [])
            if isinstance(primary_needs, list):
                for need in primary_needs:
                    if isinstance(need, dict):
                        category = need.get('category', 'Support Area')
                        description = need.get('description', '')
                        story.append(Paragraph(f"<b>{category}</b>", subsection_heading_style))
                        if description:
                            # Apply keyword highlighting to description
                            detected_categories = detect_categories_in_text(description)
                            if detected_categories:
                                description = highlight_keywords_in_text(description, list(detected_categories))
                            story.append(Paragraph(description, body_style))
                        story.append(Spacer(1, 10))
                    elif need:
                        # Apply keyword highlighting to need text
                        need_text = str(need)
                        detected_categories = detect_categories_in_text(need_text)
                        if detected_categories:
                            need_text = highlight_keywords_in_text(need_text, list(detected_categories))
                        story.append(Paragraph(need_text, body_style))
                        story.append(Spacer(1, 8))
            else:
                story.append(Paragraph(str(primary_needs), body_style))
                story.append(Spacer(1, 8))
        
        story.append(Spacer(1, 12))

    # ============= PROFESSIONAL FOOTER =============
    # story.append(PageBreak())
    story.append(Spacer(1, 20))
    
    # Professional closing statements
    story.append(Paragraph(
        "Document Confidentiality",
        subsection_heading_style
    ))
    story.append(Spacer(1, 6))
    
    footer_text = (
        "This referral form contains confidential and sensitive personal health information. "
        "It is intended solely for the use of authorized healthcare and social service professionals "
        "involved in the care and assessment of the named individual. Unauthorized access, use, or disclosure "
        "is strictly prohibited and may violate privacy laws and regulations."
    )
    story.append(Paragraph(footer_text, body_style))
    story.append(Spacer(1, 12))
    
    # Document information
    footer_info = f"""
    <b>Document Information:</b><br/>
    <b>Generated:</b> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}<br/>
    <b>System:</b> Midstream Referral Management System<br/>
    <b>Version:</b> 1.0
    """
    story.append(Paragraph(footer_info, metadata_style))
    
    # Build the PDF with page numbers
    def add_page_number(canvas, doc):
        """Add page numbers to the footer"""
        canvas.saveState()
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.HexColor('#64748b'))
        
        # Page number at bottom right
        page_num = f"Page {doc.page}"
        canvas.drawString(A4[0] - 1*inch, 0.5*inch, page_num)
        
        # Divider line
        canvas.setLineWidth(0.5)
        canvas.setStrokeColor(colors.HexColor('#cbd5e1'))
        canvas.line(0.8*inch, 0.75*inch, A4[0] - 0.8*inch, 0.75*inch)
        
        canvas.restoreState()

    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    pdf_buffer.seek(0)
    pdf_buffer.name = f"{metadata.get('firstName', '')}-{metadata.get('lastName', '')}-full-referral-form.pdf"

    return pdf_buffer


def extract_text_from_pdf(filepath):
    """Extract text content from a PDF file."""
    if not os.path.isfile(filepath):
        print(f"File does not exist: {filepath}")
        return None

    try:
        with pymupdf.open(filepath) as doc:
            text = ""
            for page in doc:
                text += page.get_text("text")
            return text

    except Exception as e:
        print(f"Error extracting text from PDF: {e} - File: {filepath}")
        return None


def create_pdf(text: str, title: str = "Referral Form") -> StreamingResponse:
    """
    Generate a PDF from text and return as a StreamingResponse.

    :param text: The narrative content for the PDF.
    :param title: The title of the document.
    :return: FastAPI StreamingResponse containing the PDF.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    story = [
        Paragraph(title, styles["Title"]),
        Spacer(1, 12),
        Paragraph(text.replace("\n", "<br/>"), styles["Normal"]),
    ]

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={title.replace(' ', '_').lower()}.pdf"}
    )