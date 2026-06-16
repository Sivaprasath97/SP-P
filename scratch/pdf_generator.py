import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

# Custom NumberedCanvas for professional headers/footers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748B'))
        
        # Header (Only on page 2 and onwards)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Technical Development Specification")
            self.setStrokeColor(colors.HexColor('#CBD5E1'))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_text)
        self.drawString(54, 40, "CONFIDENTIAL - Development Blueprint Document")
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(54, 52, 558, 52)
        
        self.restoreState()

def escape_html(text):
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    return text

def format_md_inline(text):
    # Escape HTML special chars first
    text = escape_html(text)
    
    # Replace **bold** with <b>bold</b>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    
    # Replace *italic* with <i>italic</i>
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    
    # Replace `code` with styled monospace text
    text = re.sub(r'`(.*?)`', r'<font face="Courier" color="#991B1B"><b>\1</b></font>', text)
    
    return text

def md_to_story(md_path, styles):
    story = []
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    in_code_block = False
    code_lines = []
    
    in_table = False
    table_rows = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Code block handling
        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                
                # Build rows of code lines
                code_rows = []
                for line_text in code_lines:
                    line_html = escape_html(line_text).replace(' ', '&nbsp;').replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')
                    if not line_html:
                        line_html = '&nbsp;'
                    p = Paragraph(f'<font face="Courier" size="7.5" color="#0F172A">{line_html}</font>', styles['CodeStyle'])
                    code_rows.append([p])
                
                if not code_rows:
                    code_rows.append([Paragraph('&nbsp;', styles['CodeStyle'])])
                
                t = Table(code_rows, colWidths=[504])
                t_styles = [
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('LEFTPADDING', (0,0), (-1,-1), 8),
                    ('RIGHTPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 1),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
                    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ]
                # Add outer padding for the box
                t_styles.append(('TOPPADDING', (0,0), (-1,0), 6))
                t_styles.append(('BOTTOMPADDING', (0,-1), (-1,-1), 6))
                t.setStyle(TableStyle(t_styles))
                
                story.append(t)
                story.append(Spacer(1, 10))
            i += 1
            continue
            
        if in_code_block:
            code_lines.append(line.rstrip('\r\n'))
            i += 1
            continue
            
        # Table handling
        if stripped.startswith('|'):
            if not in_table:
                in_table = True
                table_rows = []
            
            # Skip separator line (e.g. |---|---|)
            if '---' in stripped:
                i += 1
                continue
                
            # Parse cells
            cells = [cell.strip() for cell in stripped.split('|')[1:-1]]
            table_rows.append(cells)
            i += 1
            continue
        elif in_table:
            # End of table, compile it
            in_table = False
            formatted_data = []
            for r_idx, row in enumerate(table_rows):
                formatted_row = []
                for cell in row:
                    cell_html = format_md_inline(cell)
                    if r_idx == 0:
                        p = Paragraph(f'<b><font color="#FFFFFF" size="8.5">{cell_html}</font></b>', styles['TableHeaderStyle'])
                    else:
                        p = Paragraph(f'<font size="7.5" color="#334155">{cell_html}</font>', styles['TableCellStyle'])
                    formatted_row.append(p)
                formatted_data.append(formatted_row)
                
            num_cols = len(table_rows[0]) if table_rows else 1
            col_width = 504.0 / num_cols
            t = Table(formatted_data, colWidths=[col_width]*num_cols)
            
            t_styles = [
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                ('BOTTOMPADDING', (0,0), (-1,-1), 5),
                ('TOPPADDING', (0,0), (-1,-1), 5),
            ]
            for r in range(1, len(table_rows)):
                if r % 2 == 0:
                    t_styles.append(('BACKGROUND', (0, r), (-1, r), colors.HexColor('#F1F5F9')))
            t.setStyle(TableStyle(t_styles))
            story.append(t)
            story.append(Spacer(1, 10))
            continue
            
        # Empty lines
        if not stripped:
            story.append(Spacer(1, 4))
            i += 1
            continue
            
        # Title (Markdown # )
        if stripped.startswith('# '):
            title_text = format_md_inline(stripped[2:])
            story.append(Spacer(1, 15))
            story.append(Paragraph(title_text, styles['DocTitleStyle']))
            story.append(Spacer(1, 15))
            i += 1
            continue
            
        # Heading 1 (Markdown ## )
        if stripped.startswith('## '):
            h1_text = format_md_inline(stripped[3:])
            story.append(Spacer(1, 10))
            story.append(Paragraph(h1_text, styles['H1Style']))
            story.append(Spacer(1, 6))
            i += 1
            continue
            
        # Heading 2 (Markdown ### )
        if stripped.startswith('### '):
            h2_text = format_md_inline(stripped[4:])
            story.append(Spacer(1, 8))
            story.append(Paragraph(h2_text, styles['H2Style']))
            story.append(Spacer(1, 4))
            i += 1
            continue
            
        # Heading 3 (Markdown #### )
        if stripped.startswith('#### '):
            h3_text = format_md_inline(stripped[5:])
            story.append(Spacer(1, 6))
            story.append(Paragraph(h3_text, styles['H3Style']))
            story.append(Spacer(1, 3))
            i += 1
            continue
            
        # List items (* or -)
        if stripped.startswith('* ') or stripped.startswith('- '):
            list_text = format_md_inline(stripped[2:])
            story.append(Paragraph(f'&bull;&nbsp;&nbsp;{list_text}', styles['ListStyle']))
            story.append(Spacer(1, 3))
            i += 1
            continue
            
        # Ordered lists (e.g. 1. 2.)
        ordered_match = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if ordered_match:
            num = ordered_match.group(1)
            list_text = format_md_inline(ordered_match.group(2))
            story.append(Paragraph(f'{num}.&nbsp;&nbsp;{list_text}', styles['ListStyle']))
            story.append(Spacer(1, 3))
            i += 1
            continue
            
        # Horizontal rule
        if stripped == '---':
            story.append(Spacer(1, 8))
            t = Table([['']], colWidths=[504])
            t.setStyle(TableStyle([
                ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            story.append(Spacer(1, 8))
            i += 1
            continue
            
        # Regular text
        para_text = format_md_inline(stripped)
        story.append(Paragraph(para_text, styles['NormalStyle']))
        story.append(Spacer(1, 4))
        i += 1

    return story

def main():
    styles = getSampleStyleSheet()

    # Define custom styles
    doc_title_style = ParagraphStyle(
        'DocTitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        spaceAfter=15,
        textColor=colors.HexColor('#0F172A')
    )

    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True,
        textColor=colors.HexColor('#1E3A8A')
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True,
        textColor=colors.HexColor('#0F172A')
    )

    h3_style = ParagraphStyle(
        'H3Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True,
        textColor=colors.HexColor('#475569')
    )

    normal_style = ParagraphStyle(
        'NormalStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )

    list_style = ParagraphStyle(
        'ListStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0F172A'),
    )

    table_header_style = ParagraphStyle(
        'TableHeaderStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCellStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#334155')
    )

    custom_styles = {
        'DocTitleStyle': doc_title_style,
        'H1Style': h1_style,
        'H2Style': h2_style,
        'H3Style': h3_style,
        'NormalStyle': normal_style,
        'ListStyle': list_style,
        'CodeStyle': code_style,
        'TableHeaderStyle': table_header_style,
        'TableCellStyle': table_cell_style
    }

    files_to_convert = [
        ('devflow_spec.md', 'devflow_spec.pdf'),
        ('project_quantum_spec.md', 'project_quantum_spec.pdf'),
        ('project_apex_spec.md', 'project_apex_spec.pdf')
    ]

    docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs'))
    
    print(f"Checking directory: {docs_dir}")
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir)

    for md_file, pdf_file in files_to_convert:
        md_path = os.path.join(docs_dir, md_file)
        pdf_path = os.path.join(docs_dir, pdf_file)
        
        if not os.path.exists(md_path):
            print(f"Skipping {md_file}: File not found at {md_path}")
            continue

        print(f"Converting {md_file} to {pdf_file}...")
        try:
            # Set topMargin to 72 (1 inch) and bottomMargin to 72 (1 inch)
            # Left and right margins to 54 (0.75 inch)
            doc = SimpleDocTemplate(
                pdf_path,
                pagesize=letter,
                leftMargin=54,
                rightMargin=54,
                topMargin=72,
                bottomMargin=72
            )
            
            story = md_to_story(md_path, custom_styles)
            
            doc.build(story, canvasmaker=NumberedCanvas)
            print(f"Successfully generated: {pdf_path}")
        except Exception as e:
            print(f"Error converting {md_file}: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    main()
