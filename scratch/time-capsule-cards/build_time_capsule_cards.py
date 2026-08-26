from pathlib import Path
from math import cos, radians, sin

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


OUTPUT = Path("output/pdf/house-of-rose-time-capsule-cards.pdf")

IVORY = HexColor("#FFFDF5")
GOLD = HexColor("#A87328")
GOLD_LIGHT = HexColor("#C89A52")
CHARCOAL = HexColor("#282329")
BLUSH = HexColor("#EEC7BE")
BLUSH_DARK = HexColor("#C98278")
SAGE = HexColor("#7D8973")
CUT = HexColor("#B9AA93")


def register_fonts():
    font_dir = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("BodoniSC", str(font_dir / "Bodoni 72 Smallcaps Book.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia", str(font_dir / "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont("GeorgiaItalic", str(font_dir / "Georgia Italic.ttf")))
    pdfmetrics.registerFont(TTFont("GeorgiaBold", str(font_dir / "Georgia Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Chancery", str(font_dir / "Apple Chancery.ttf")))


def draw_centered_spaced_text(c, text, x, y, font_name, font_size, color, spacing):
    c.saveState()
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    widths = [pdfmetrics.stringWidth(ch, font_name, font_size) for ch in text]
    total = sum(widths) + spacing * max(0, len(text) - 1)
    cursor = x - total / 2
    for ch, width in zip(text, widths):
        c.drawString(cursor, y, ch)
        cursor += width + spacing
    c.restoreState()


def draw_leaf(c, x, y, length, width, angle, fill):
    c.saveState()
    c.translate(x, y)
    c.rotate(angle)
    c.setFillColor(fill)
    c.setStrokeColor(fill)
    c.setLineWidth(0.35)
    path = c.beginPath()
    path.moveTo(0, 0)
    path.curveTo(length * 0.22, width, length * 0.78, width * 0.75, length, 0)
    path.curveTo(length * 0.78, -width * 0.75, length * 0.22, -width, 0, 0)
    path.close()
    c.drawPath(path, fill=1, stroke=1)
    c.setStrokeColor(Color(1, 1, 1, alpha=0.45))
    c.line(length * 0.08, 0, length * 0.88, 0)
    c.restoreState()


def draw_rose(c, x, y, scale=1.0):
    c.saveState()
    c.translate(x, y)
    c.setLineWidth(0.45)
    layers = [
        (12.5, 6.5, BLUSH, 0, 6),
        (9.2, 4.8, HexColor("#F4D6CF"), 18, 5),
        (6.4, 3.3, BLUSH, 5, 4),
    ]
    for rx, ry, color, offset, count in layers:
        for i in range(count):
            c.saveState()
            c.rotate(offset + i * (360 / count))
            c.setFillColor(color)
            c.setStrokeColor(BLUSH_DARK)
            c.ellipse(-rx * scale, -ry * scale, rx * scale, ry * scale, fill=1, stroke=1)
            c.restoreState()
    c.setFillColor(BLUSH_DARK)
    c.circle(0, 0, 2.1 * scale, fill=1, stroke=0)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.55)
    c.arc(-4 * scale, -4 * scale, 4 * scale, 4 * scale, 20, 300)
    c.restoreState()


def draw_rose_sprig(c, x, y, scale=1.0):
    c.saveState()
    c.setStrokeColor(SAGE)
    c.setLineWidth(0.8)
    c.line(x - 25 * scale, y - 4 * scale, x - 8 * scale, y)
    c.line(x + 8 * scale, y, x + 25 * scale, y + 4 * scale)
    draw_leaf(c, x - 12 * scale, y - 1 * scale, 13 * scale, 3.3 * scale, 155, SAGE)
    draw_leaf(c, x - 19 * scale, y - 3 * scale, 11 * scale, 3 * scale, 205, HexColor("#93A087"))
    draw_leaf(c, x + 12 * scale, y + 1 * scale, 13 * scale, 3.3 * scale, 25, SAGE)
    draw_leaf(c, x + 19 * scale, y + 3 * scale, 11 * scale, 3 * scale, -25, HexColor("#93A087"))
    draw_rose(c, x, y, scale)
    c.restoreState()


def draw_corner_flourish(c, x, y, sx, sy):
    c.saveState()
    c.translate(x, y)
    c.scale(sx, sy)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.75)
    p = c.beginPath()
    p.moveTo(0, 12)
    p.curveTo(0, 5, 4, 1, 12, 1)
    p.curveTo(7, 4, 7, 9, 12, 11)
    c.drawPath(p, fill=0, stroke=1)
    p = c.beginPath()
    p.moveTo(12, 1)
    p.curveTo(5, 1, 1, 5, 1, 12)
    p.curveTo(4, 7, 9, 7, 11, 12)
    c.drawPath(p, fill=0, stroke=1)
    c.circle(12, 12, 1.1, fill=0, stroke=1)
    c.restoreState()


def draw_card_border(c, x, y, w, h):
    inset = 0.17 * inch
    inner = inset + 4
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.rect(x + inset, y + inset, w - 2 * inset, h - 2 * inset, fill=0, stroke=1)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.35)
    c.rect(x + inner, y + inner, w - 2 * inner, h - 2 * inner, fill=0, stroke=1)
    c.restoreState()


def draw_rule(c, x1, x2, y):
    c.saveState()
    c.setStrokeColor(HexColor("#C8A66F"))
    c.setLineWidth(0.45)
    c.line(x1, y, x2, y)
    c.restoreState()


def draw_prompt(c, text, x, y, width, lines=2):
    c.saveState()
    c.setFillColor(CHARCOAL)
    c.setFont("GeorgiaItalic", 8.5)
    c.drawString(x, y, text)
    line_y = y - 13
    for _ in range(lines):
        draw_rule(c, x, x + width, line_y)
        line_y -= 15
    c.restoreState()


def draw_card(c, x, y, w, h):
    draw_card_border(c, x, y, w, h)
    cx = x + w / 2
    left = x + 0.42 * inch
    right = x + w - 0.42 * inch

    draw_rose_sprig(c, cx, y + h - 0.45 * inch, 0.72)
    draw_centered_spaced_text(c, "TIME CAPSULE", cx, y + h - 0.91 * inch, "BodoniSC", 15.5, CHARCOAL, 1.35)
    c.setFillColor(GOLD)
    c.setFont("Chancery", 9.5)
    c.drawCentredString(cx, y + h - 1.10 * inch, "A note for the birthday girl")

    meta_y = y + h - 1.39 * inch
    c.setFillColor(CHARCOAL)
    c.setFont("Georgia", 7.9)
    c.drawString(left, meta_y, "From:")
    draw_rule(c, left + 27, cx - 10, meta_y - 1)
    c.drawString(cx + 10, meta_y, "Today's date:")
    draw_rule(c, cx + 70, right, meta_y - 1)

    draw_prompt(c, "A favorite memory from today:", left, y + h - 1.72 * inch, right - left, lines=3)

    fold_y = y + h / 2 + 0.02 * inch
    c.saveState()
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.45)
    c.setDash(2, 3)
    c.line(left, fold_y, right, fold_y)
    c.setDash()
    c.setFillColor(IVORY)
    c.rect(cx - 43, fold_y - 5, 86, 10, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("Georgia", 5.8)
    c.drawCentredString(cx, fold_y - 2, "FOLD HERE AFTER WRITING")
    c.restoreState()

    draw_prompt(c, "Something I hope you always remember:", left, fold_y - 24, right - left, lines=2)
    draw_prompt(c, "My wish for your next year:", left, fold_y - 76, right - left, lines=2)

    open_y = y + 0.56 * inch
    c.setFillColor(CHARCOAL)
    c.setFont("Georgia", 7.7)
    c.drawString(left, open_y, "Open on:")
    draw_rule(c, left + 42, right, open_y - 1)

    c.setFillColor(GOLD)
    c.setFont("BodoniSC", 6.7)
    c.drawCentredString(cx, y + 0.37 * inch, "HOUSE OF ROSE AESTHETICS")
    c.setFont("Chancery", 6.5)
    c.drawCentredString(cx, y + 0.26 * inch, "Fold, seal, and save a little birthday magic")


def build_pdf():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    page_w, page_h = letter
    c = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1)
    c.setTitle("House of Rose Time Capsule Note Cards")
    c.setAuthor("House of Rose Aesthetics")
    c.setSubject("Four matching birthday time capsule note cards")

    c.setFillColor(IVORY)
    c.rect(0, 0, page_w, page_h, fill=1, stroke=0)

    card_w = page_w / 2
    card_h = page_h / 2
    for x in (0, card_w):
        for y in (0, card_h):
            draw_card(c, x, y, card_w, card_h)

    c.saveState()
    c.setStrokeColor(CUT)
    c.setLineWidth(0.45)
    c.setDash(3, 3)
    c.line(card_w, 0, card_w, page_h)
    c.line(0, card_h, page_w, card_h)
    c.restoreState()

    c.showPage()
    c.save()


if __name__ == "__main__":
    build_pdf()
