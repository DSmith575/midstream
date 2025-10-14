from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
import os
import pymupdf
from datetime import datetime
from fastapi.responses import StreamingResponse
from io import BytesIO

def generate_pdf_with_audio_transcript(text: str, filename: str) -> BytesIO:
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=A4,
                            rightMargin=50, leftMargin=50,
                            topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f"<b>{filename} Audio Transcription</b>", styles["Title"]))
    story.append(Spacer(1, 12))

    # Transcription text
    for line in text.split("\n"):
        story.append(Paragraph(line, styles["Normal"]))
        story.append(Spacer(1, 12))

    doc.build(story)
    pdf_buffer.seek(0)
    pdf_buffer.name = f"{filename}.pdf"
    return pdf_buffer

def generate_full_referral_form(metadata: dict, extracted_ai_text: dict):
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=A4,
                            rightMargin=50, leftMargin=50,
                            topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    heading_style = ParagraphStyle('ColoredHeading', parent=styles['Heading2'], textColor=colors.black)
    paragraph_style = styles['BodyText']

    story = []

    # Add title
    story.append(Paragraph(f"{metadata.get('firstName', '')} {metadata.get('lastName', '')} Full Referral Form", styles['Title']))
    story.append(Spacer(1, 12))

    # --- Metadata Section with bullets ---
    story.append(Paragraph("Referral Metadata", heading_style))
    story.append(Spacer(1, 6))

    def create_bullet_items(data):
        items = []
        for section, content in data.items():
            if not isinstance(content, dict):
                continue

            # Top-level bullet (section title)
            section_title = section.replace('_', ' ').title()
            section_items = []

            for key, value in content.items():
                if key == 'id' or value is None:
                    continue
                label = key.replace('_', ' ').title()
                section_items.append(ListItem(Paragraph(f"<b>{label}:</b> {value}", paragraph_style)))

            if section_items:
                # Add main bullet for the section
                items.append(ListItem(Paragraph(f"<b>{section_title}:</b>", paragraph_style)))
                # Add nested bullets
                items.extend(section_items)
        return items

    story.append(ListFlowable(create_bullet_items(metadata), bulletType='bullet', leftIndent=12))
    story.append(Spacer(1, 12))

    # --- AI Extracted Text Section ---
    story.append(Paragraph("AI Extracted Information", heading_style))
    story.append(Spacer(1, 6))

    for section, items in extracted_ai_text.items():
        story.append(Paragraph(section, heading_style))
        story.append(Spacer(1, 6))

        for item, response in items.items():
            # Add item as the subheading
            story.append(Paragraph(item, styles['Heading3']))

            # Add the response as a paragraph
            story.append(Paragraph(
                str(response) if response else "No relevant information found.", paragraph_style))
            story.append(Spacer(1, 6))

    doc.build(story)
    pdf_buffer.seek(0)
    pdf_buffer.name = f"{metadata.get('firstName', '')}-{metadata.get('lastName', '')}-full-referral-form.pdf"

    return pdf_buffer


#     output_filepath = os.path.join(uploads_dir, filename)

#     try:
#         doc = SimpleDocTemplate(output_filepath, pagesize=A4)
#         story = []

#         styles = getSampleStyleSheet()
#         heading_style = ParagraphStyle(
#             'ColoredHeading',
#             parent=styles['Heading2'],
#             textColor=colors.blue
#         )

#         subheading_style = ParagraphStyle(
#             'ColoredSubheading',
#             parent=styles['Heading3'],
#             textColor=colors.black
#         )

#         paragraph_style = styles['BodyText']

#         story.append(Paragraph('Processed AI Transcription', styles['Title']))
#         story.append(Spacer(1, 12))

#         for section, items in form_data.items():

#             story.append(Paragraph(section, heading_style))
#             story.append(Spacer(1, 6))

#             for item, response in items.items():
#                 # Add item as the subheading
#                 story.append(Paragraph(item, subheading_style))

#                 # Add the response as a paragraph
#                 story.append(Paragraph(
#                     str(response) if response else "No relevant information found.", paragraph_style))

#                 story.append(Spacer(1, 6))

#         doc.build(story)
#         return output_filepath

#     except Exception as e:
#         print(f"Failed to write processed data: {e}")
#         return None

# def save_form_data_to_pdf(form_data, filename, uploads_dir):
#     output_filepath = os.path.join(uploads_dir, filename)

#     try:
#         doc = SimpleDocTemplate(output_filepath, pagesize=A4)
#         story = []

#         styles = getSampleStyleSheet()
#         heading_style = ParagraphStyle(
#             'ColoredHeading',
#             parent=styles['Heading2'],
#             textColor=colors.blue
#         )

#         subheading_style = ParagraphStyle(
#             'ColoredSubheading',
#             parent=styles['Heading3'],
#             textColor=colors.black
#         )

#         paragraph_style = styles['BodyText']

#         story.append(Paragraph('Processed AI Transcription', styles['Title']))
#         story.append(Spacer(1, 12))

#         for section, items in form_data.items():

#             story.append(Paragraph(section, heading_style))
#             story.append(Spacer(1, 6))

#             for item, response in items.items():
#                 # Add item as the subheading
#                 story.append(Paragraph(item, subheading_style))

#                 # Add the response as a paragraph
#                 story.append(Paragraph(
#                     str(response) if response else "No relevant information found.", paragraph_style))

#                 story.append(Spacer(1, 6))

#         doc.build(story)
#         return output_filepath

#     except Exception as e:
#         print(f"Failed to write processed data: {e}")
#         return None


def extract_text_from_pdf(filepath):
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


def extract_referral_form_data_from_pdf(filepath):
    if not os.path.isfile(filepath):
        print(f"File does not exist: {filepath}")
        return None

    try:
        with pymupdf.open(filepath) as doc:
            # Initialize an empty dictionary to store the form data
            form_data = {}
            section_key = None

            # Iterate through pdf, if line contains "Section", then set as dict key
            for page in doc:
                lines = page.get_text("text").split("\n")
                for line in lines:
                    # If the line contains "Section", then set as dict key
                    if "Section" in line:
                        section_key = line.split(
                            ": ", 1)[1].strip()  # Clean up whitespace
                        # Initialize a new dictionary for the section
                        form_data[section_key] = {}
                    elif section_key is not None:
                        # Add the line to the current section
                        # Split the line into key-value pairs if applicable
                        # Split at the first occurrence of ": "
                        key_value = line.split(": ", 1)
                        if len(key_value) == 2:
                            key = key_value[0].strip()
                            value = key_value[1].strip()
                            # Store in the corresponding section
                            form_data[section_key][key] = value

            return form_data

    except Exception as e:
        print(f"Error extracting text from PDF: {e} - File: {filepath}")
        return None


def save_referral_form_to_pdf(form_data, first_name, last_name, processed_dir):
    pdf_filename = f"{first_name}-{last_name}-referral-form.pdf"
    print(f"Saving referral form to PDF: {pdf_filename}")
    pdf_filepath = os.path.join(processed_dir, pdf_filename)

    try:
        doc = SimpleDocTemplate(pdf_filepath, pagesize=A4)
        story = []

        styles = getSampleStyleSheet()
        heading_style = ParagraphStyle(
            'ColoredHeading',
            parent=styles['Heading2'],
            textColor=colors.black
        )
        paragraph_style = styles['BodyText']

        # Add title
        story.append(
            Paragraph(f'{first_name} {last_name} Referral Form', styles['Title']))
        story.append(Spacer(1, 12))

        # Iterate through each section in the data object
        for section_key, section_value in form_data.items():
            # Add the section header
            story.append(Paragraph(section_value['header'], heading_style))

            story.append(Spacer(1, 6))

            # Add the content of the section
            for field, value in section_value.items():
                # Skip the header field
                if field != 'header':
                    # Create a combined paragraph for the field name and value
                    combined_paragraph = Paragraph(
                        f"<b>{field.replace('_', ' ').title(
                        ) if field != 'NHI' else 'NHI'}:</b> {value}",
                        paragraph_style
                    )
                    story.append(combined_paragraph)

            story.append(Spacer(1, 12))

        doc.build(story)

        return pdf_filepath
    except Exception as e:
        print(f"An error occurred while creating the PDF: {e}")


def build_assessment_form(audio_data, referral_data, process_path, filename):
    output_filepath = os.path.join(process_path, filename)

    try:
        doc = SimpleDocTemplate(output_filepath, pagesize=A4)
        story = []

        styles = getSampleStyleSheet()
        heading_style = ParagraphStyle(
            'ColoredHeading',
            parent=styles['Heading2'],
            textColor=colors.black
        )

        subheading_style = ParagraphStyle(
            'ColoredSubheading',
            parent=styles['Heading3'],
            textColor=colors.black
        )

        paragraph_style = styles['BodyText']

        story.append(Paragraph('Assessment Information', styles['Title']))
        story.append(Spacer(1, 8))

        assessment_completion_date = Paragraph(
            f"<b>Assessment completion date:</b> {
                datetime.now().strftime('%Y-%m-%d')}",
            paragraph_style
        )

        story.append(assessment_completion_date)

        for section, items in referral_data.items():
            story.append(Paragraph(section, heading_style))
            story.append(Spacer(1, 4))

            for item, response in items.items():
                combined_paragraph = Paragraph(
                    f"<b>{item}:</b> {response}",
                    paragraph_style
                )
                story.append(combined_paragraph)

        story.append(Spacer(1, 12))

        for section, items in audio_data.items():
            story.append(Paragraph(section, heading_style))
            story.append(Spacer(1, 6))

            for item, response in items.items():
                # Add item as the subheading
                story.append(Paragraph(item, subheading_style))

                # Add the response as a paragraph
                story.append(Paragraph(
                    str(response) if response else "No relevant information found.", paragraph_style))

                story.append(Spacer(1, 6))

        doc.build(story)
        return output_filepath

    except Exception as e:
        print(f"Failed to write assessment form to PDF: {e}")
        raise


def create_pdf(text: str, title: str = "Referral Form") -> StreamingResponse:
    """
    Generate a PDF from text and return as a StreamingResponse.

    :param text: The narrative content for the PDF.
    :param title: The title of the document.
    :return: FastAPI StreamingResponse containing the PDF.
    """
    buffer = io.BytesIO()
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