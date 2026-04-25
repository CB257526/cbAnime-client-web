import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black
from reportlab.lib.units import mm, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

md_file = r"C:\Users\cb135\Desktop\cbAnimeHtml\cbAnime-client-web\ADMIN_README.md"
pdf_file = r"C:\Users\cb135\Desktop\cbAnimeHtml\cbAnime-client-web\ADMIN_README.pdf"

font_path = r"C:\Windows\Fonts\simhei.ttf"
if not os.path.exists(font_path):
    font_path = r"C:\Windows\Fonts\msyh.ttc"

pdfmetrics.registerFont(TTFont('ChineseFont', font_path))

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(
    name='Title_Custom',
    fontName='ChineseFont',
    fontSize=22,
    leading=32,
    spaceAfter=16,
    alignment=TA_LEFT,
    textColor=HexColor('#2d2d3a'),
))

styles.add(ParagraphStyle(
    name='Heading1_Custom',
    fontName='ChineseFont',
    fontSize=16,
    leading=24,
    spaceBefore=18,
    spaceAfter=10,
    alignment=TA_LEFT,
    textColor=HexColor('#ff6b8a'),
    borderWidth=0,
))

styles.add(ParagraphStyle(
    name='Heading2_Custom',
    fontName='ChineseFont',
    fontSize=13,
    leading=20,
    spaceBefore=12,
    spaceAfter=8,
    alignment=TA_LEFT,
    textColor=HexColor('#2d2d3a'),
    borderWidth=0,
))

styles.add(ParagraphStyle(
    name='Body_Custom',
    fontName='ChineseFont',
    fontSize=10,
    leading=18,
    spaceAfter=6,
    alignment=TA_LEFT,
    textColor=HexColor('#4a4a5a'),
    wordWrap='CJK',
))

styles.add(ParagraphStyle(
    name='Bullet_Custom',
    fontName='ChineseFont',
    fontSize=10,
    leading=18,
    leftIndent=20,
    spaceAfter=4,
    alignment=TA_LEFT,
    textColor=HexColor('#4a4a5a'),
    bulletFontName='ChineseFont',
    bulletFontSize=10,
    bulletIndent=8,
    wordWrap='CJK',
))

styles.add(ParagraphStyle(
    name='Code_Custom',
    fontName='ChineseFont',
    fontSize=9,
    leading=14,
    leftIndent=10,
    rightIndent=10,
    spaceBefore=6,
    spaceAfter=6,
    alignment=TA_LEFT,
    textColor=HexColor('#6b5b95'),
    backColor=HexColor('#f5f5f7'),
    wordWrap='CJK',
    borderPadding=6,
    borderWidth=0.5,
    borderColor=HexColor('#e0e0e0'),
))

def parse_markdown_to_flowables(md_content):
    flowables = []
    lines = md_content.split('\n')
    in_code_block = False
    code_content = []
    bullet_list_mode = False
    
    for line in lines:
        if line.strip().startswith('```'):
            if in_code_block:
                if code_content:
                    code_text = '\n'.join(code_content)
                    code_text = code_text.replace('<', '&lt;').replace('>', '&gt;')
                    code_para = Paragraph(code_text, styles['Code_Custom'])
                    flowables.append(code_para)
                    code_content = []
                in_code_block = False
            else:
                in_code_block = True
            continue
        
        if in_code_block:
            code_content.append(line)
            continue
        
        stripped = line.strip()
        
        if not stripped:
            if bullet_list_mode:
                bullet_list_mode = False
            if flowables and isinstance(flowables[-1], Spacer):
                pass
            else:
                flowables.append(Spacer(1, 6))
            continue
        
        if stripped.startswith('---'):
            flowables.append(HRFlowable(width='100%', thickness=1, color=HexColor('#ff6b8a'), spaceBefore=10, spaceAfter=10))
            continue
        
        if stripped.startswith('# '):
            text = stripped[2:]
            text = text.replace('<', '&lt;').replace('>', '&gt;')
            flowables.append(Paragraph(text, styles['Title_Custom']))
            continue
        
        if stripped.startswith('## '):
            text = stripped[3:]
            text = text.replace('<', '&lt;').replace('>', '&gt;')
            flowables.append(Paragraph(text, styles['Heading1_Custom']))
            flowables.append(HRFlowable(width='100%', thickness=0.5, color=HexColor('#ffc2d1'), spaceBefore=0, spaceAfter=6))
            continue
        
        if stripped.startswith('### '):
            text = stripped[4:]
            text = text.replace('<', '&lt;').replace('>', '&gt;')
            flowables.append(Paragraph(text, styles['Heading2_Custom']))
            continue
        
        if stripped.startswith('- '):
            text = stripped[2:]
            if text.startswith('`') and '`' in text[1:]:
                parts = text.split('`')
                text = '  ' + ('' if len(parts) < 2 else parts[1]) + ''.join(parts[2:])
            bullet_text = '  ' + text
            bullet_text = bullet_text.replace('<', '&lt;').replace('>', '&gt;')
            flowables.append(Paragraph(bullet_text, styles['Bullet_Custom']))
            bullet_list_mode = True
            continue
        
        if stripped:
            text = stripped
            if '`' in text:
                parts = text.split('`')
                new_parts = []
                for i, part in enumerate(parts):
                    if i % 2 == 1:
                        new_parts.append(f'<font color="#ff6b8a">{part}</font>')
                    else:
                        new_parts.append(part)
                text = ''.join(new_parts)
            text = text.replace('<', '&lt;').replace('>', '&gt;')
            flowables.append(Paragraph(text, styles['Body_Custom']))
    
    return flowables

with open(md_file, 'r', encoding='utf-8') as f:
    md_content = f.read()

doc = SimpleDocTemplate(
    pdf_file,
    pagesize=A4,
    topMargin=2*cm,
    bottomMargin=2*cm,
    leftMargin=2*cm,
    rightMargin=2*cm,
)

flowables = parse_markdown_to_flowables(md_content)
doc.build(flowables)

print(f"PDF generated successfully: {pdf_file}")
