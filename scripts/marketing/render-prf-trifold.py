#!/usr/bin/env python3
"""Render the House of Rose customer-facing PRF tri-fold brochure."""

from __future__ import annotations

raise SystemExit(
    "VOICE RESET: PRF brochure rendering is disabled until PRF Bio-Filler/EZ Gel identity and brochure claims are reverified."
)

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Frame, Paragraph, Spacer


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "house-of-rose-prf-trifold-brochure.pdf"

MONOGRAM = ROOT / "packages/web/public/logos/house-of-rose-monogram/hr-logo-gold.webp"
FULL_LOGO = ROOT / "packages/web/public/logos/house-ofRose_aesth.webp"
WELCOME = ROOT / "packages/web/public/images/welcome-house-of-rose.webp"
EXTERIOR = ROOT / "packages/web/public/images/H_OF_A_EXTERIOR_WINDOW_DECALS.webp"
BEFORE_AFTER = ROOT / "packages/web/public/images/before-after/prf-undereyes-ezgel.png"

PAGE_W, PAGE_H = landscape(letter)
PANEL_FLAP = 3.625 * inch
PANEL_STANDARD = 3.6875 * inch
PANEL_X = (0, PANEL_FLAP, PANEL_FLAP + PANEL_STANDARD)
PANEL_W = (PANEL_FLAP, PANEL_STANDARD, PANEL_STANDARD)

INK = HexColor("#171513")
SOFT_INK = HexColor("#4A433B")
CHARCOAL = HexColor("#11110F")
DEEP_BLUE = HexColor("#243746")
CREAM = HexColor("#F7F1E7")
PAPER = HexColor("#FBF8F2")
ROSE = HexColor("#E8D9CE")
GOLD = HexColor("#C7A35A")
GOLD_DARK = HexColor("#936F2F")
GOLD_PALE = HexColor("#E8D7AF")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#766C61")

_IMAGE_CACHE: dict[tuple[str, int, int, float, float, float], ImageReader] = {}


def register_fonts() -> None:
    cochin = "/System/Library/Fonts/Supplemental/Cochin.ttc"
    avenir = "/System/Library/Fonts/Avenir.ttc"

    pdfmetrics.registerFont(TTFont("Cochin", cochin, subfontIndex=0))
    pdfmetrics.registerFont(TTFont("Cochin-Bold", cochin, subfontIndex=1))
    pdfmetrics.registerFont(TTFont("Cochin-Italic", cochin, subfontIndex=2))
    pdfmetrics.registerFont(TTFont("Cochin-BoldItalic", cochin, subfontIndex=3))

    pdfmetrics.registerFont(TTFont("Avenir", avenir, subfontIndex=0))
    pdfmetrics.registerFont(TTFont("Avenir-Heavy", avenir, subfontIndex=4))
    pdfmetrics.registerFont(TTFont("Avenir-Light", avenir, subfontIndex=6))
    pdfmetrics.registerFont(TTFont("Avenir-Medium", avenir, subfontIndex=8))

    pdfmetrics.registerFontFamily(
        "Cochin",
        normal="Cochin",
        bold="Cochin-Bold",
        italic="Cochin-Italic",
        boldItalic="Cochin-BoldItalic",
    )
    pdfmetrics.registerFontFamily(
        "Avenir",
        normal="Avenir",
        bold="Avenir-Heavy",
        italic="Avenir",
        boldItalic="Avenir-Heavy",
    )


def _processed_cover_image(
    path: Path,
    pixel_w: int,
    pixel_h: int,
    focal_x: float = 0.5,
    focal_y: float = 0.5,
    contrast: float = 1.0,
) -> ImageReader:
    key = (str(path), pixel_w, pixel_h, focal_x, focal_y, contrast)
    if key in _IMAGE_CACHE:
        return _IMAGE_CACHE[key]

    with Image.open(path) as source:
        image = source.convert("RGB")
        src_ratio = image.width / image.height
        dst_ratio = pixel_w / pixel_h

        if src_ratio > dst_ratio:
            crop_w = int(image.height * dst_ratio)
            left = int((image.width - crop_w) * focal_x)
            left = max(0, min(left, image.width - crop_w))
            box = (left, 0, left + crop_w, image.height)
        else:
            crop_h = int(image.width / dst_ratio)
            top = int((image.height - crop_h) * focal_y)
            top = max(0, min(top, image.height - crop_h))
            box = (0, top, image.width, top + crop_h)

        image = image.crop(box).resize((pixel_w, pixel_h), Image.Resampling.LANCZOS)
        if contrast != 1.0:
            image = ImageEnhance.Contrast(image).enhance(contrast)

        buffer = BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        buffer.seek(0)
        reader = ImageReader(buffer)
        reader._buffer = buffer  # Keep bytes alive for ReportLab.
        _IMAGE_CACHE[key] = reader
        return reader


def draw_cover_image(
    c: canvas.Canvas,
    path: Path,
    x: float,
    y: float,
    w: float,
    h: float,
    *,
    focal_x: float = 0.5,
    focal_y: float = 0.5,
    contrast: float = 1.0,
) -> None:
    scale = 3
    reader = _processed_cover_image(
        path,
        max(1, int(w * scale)),
        max(1, int(h * scale)),
        focal_x,
        focal_y,
        contrast,
    )
    c.drawImage(reader, x, y, width=w, height=h, mask="auto")


def trimmed_logo(path: Path) -> ImageReader:
    key = (str(path), 0, 0, 0.0, 0.0, 0.0)
    if key in _IMAGE_CACHE:
        return _IMAGE_CACHE[key]

    with Image.open(path) as source:
        image = source.convert("RGBA")
        alpha = image.getchannel("A")
        bbox = alpha.getbbox()
        if bbox:
            image = image.crop(bbox)
        buffer = BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        buffer.seek(0)
        reader = ImageReader(buffer)
        reader._buffer = buffer
        _IMAGE_CACHE[key] = reader
        return reader


def paragraph_style(
    name: str,
    *,
    font: str = "Avenir",
    size: float = 9.4,
    leading: float = 12.4,
    color=INK,
    space_after: float = 5,
    alignment: int = TA_LEFT,
) -> ParagraphStyle:
    return ParagraphStyle(
        name=name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        spaceAfter=space_after,
        alignment=alignment,
        allowWidows=0,
        allowOrphans=0,
    )


STYLES = {
    "panel_kicker": paragraph_style(
        "panel_kicker",
        font="Avenir-Heavy",
        size=7.4,
        leading=9.2,
        color=GOLD_DARK,
        space_after=4,
    ),
    "panel_title": paragraph_style(
        "panel_title",
        font="Cochin",
        size=18.2,
        leading=19.5,
        color=INK,
        space_after=7,
    ),
    "section_title": paragraph_style(
        "section_title",
        font="Cochin-Bold",
        size=11.7,
        leading=13.2,
        color=GOLD_DARK,
        space_after=3,
    ),
    "body": paragraph_style("body"),
    "body_tight": paragraph_style("body_tight", size=8.9, leading=11.5, space_after=4),
    "bullet": paragraph_style("bullet", size=8.8, leading=11.5, space_after=2),
    "small": paragraph_style("small", size=7.6, leading=9.6, color=MUTED, space_after=3),
    "small_ink": paragraph_style("small_ink", size=7.7, leading=9.8, color=SOFT_INK, space_after=3),
    "center_small": paragraph_style(
        "center_small", size=7.5, leading=9.6, color=SOFT_INK, alignment=TA_CENTER
    ),
}


def P(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, STYLES[style])


def rule_flowable() -> Spacer:
    return Spacer(1, 1)


def draw_story(
    c: canvas.Canvas,
    story: list,
    x: float,
    y: float,
    w: float,
    h: float,
    *,
    top_padding: float = 0,
    bottom_padding: float = 0,
) -> None:
    frame = Frame(
        x,
        y,
        w,
        h,
        leftPadding=0,
        rightPadding=0,
        topPadding=top_padding,
        bottomPadding=bottom_padding,
        showBoundary=0,
    )
    frame.addFromList(story, c)
    if story:
        raise RuntimeError(f"Panel content overflowed by {len(story)} flowable(s)")


def draw_gold_rule(c: canvas.Canvas, x: float, y: float, w: float) -> None:
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.75)
    c.line(x, y, x + w, y)


def draw_qr(c: canvas.Canvas, url: str, x: float, y: float, size: float) -> None:
    widget = QrCodeWidget(url, barLevel="H")
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(
        size,
        size,
        transform=[size / width, 0, 0, size / height, 0, 0],
    )
    drawing.add(widget)
    c.setFillColor(WHITE)
    c.roundRect(x - 4, y - 4, size + 8, size + 8, 5, stroke=0, fill=1)
    renderPDF.draw(drawing, c, x, y)


def draw_outside(c: canvas.Canvas) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Fold-in flap: benefit-led introduction with candid expectations.
    flap_x, flap_w = PANEL_X[0], PANEL_W[0]
    c.setFillColor(CREAM)
    c.rect(flap_x, 0, flap_w, PAGE_H, stroke=0, fill=1)
    c.setFillColor(ROSE)
    c.rect(flap_x, PAGE_H - 14, flap_w, 14, stroke=0, fill=1)
    c.setStrokeColor(GOLD_PALE)
    c.setLineWidth(0.8)
    c.line(flap_x + flap_w - 0.5, 22, flap_x + flap_w - 0.5, PAGE_H - 22)

    margin = 23
    draw_story(
        c,
        [
            P("WHY CLIENTS CHOOSE PRF", "panel_kicker"),
            P("Subtle renewal, made from you.", "panel_title"),
            P(
                "Platelet-rich fibrin is prepared from a small sample of your own blood and used in a personalized aesthetic plan. It is designed for gradual, natural-looking improvement rather than dramatic correction.",
                "body",
            ),
            Spacer(1, 7),
            P("Benefits we may discuss", "section_title"),
            P("- A refreshed look beneath the eyes and in other delicate areas", "bullet"),
            P("- Softer-looking fine lines and improved overall skin quality", "bullet"),
            P("- More even-looking texture, tone and radiance", "bullet"),
            P("- Subtle, temporary volume with EZ Gel where appropriate", "bullet"),
            P("- A client-derived option without synthetic filler material", "bullet"),
            Spacer(1, 7),
            P("A plan selected for your goals", "section_title"),
            P(
                "Liquid PRF, EZ Gel and topical PRF are different approaches. A licensed provider confirms which option, treatment area and timing are appropriate after reviewing your health history and expectations.",
                "body_tight",
            ),
            Spacer(1, 5),
            P(
                "A small blood draw is part of every PRF appointment. Temporary redness, swelling, tenderness or bruising may occur. Not every client is a candidate, and individual results vary.",
                "small_ink",
            ),
        ],
        flap_x + margin,
        28,
        flap_w - margin * 2,
        PAGE_H - 58,
    )

    # Back cover: real client result, contact details and final disclosure.
    back_x, back_w = PANEL_X[1], PANEL_W[1]
    c.setFillColor(PAPER)
    c.rect(back_x, 0, back_w, PAGE_H, stroke=0, fill=1)

    full_logo = trimmed_logo(FULL_LOGO)
    logo_w = 145
    logo_h = 58
    c.drawImage(
        full_logo,
        back_x + (back_w - logo_w) / 2,
        PAGE_H - 83,
        width=logo_w,
        height=logo_h,
        preserveAspectRatio=True,
        anchor="c",
        mask="auto",
    )
    draw_gold_rule(c, back_x + 24, PAGE_H - 96, back_w - 48)

    c.setFont("Cochin", 16.8)
    c.setFillColor(INK)
    c.drawCentredString(back_x + back_w / 2, PAGE_H - 122, "Real result. Thoughtful expectations.")

    result_x = back_x + 20
    result_w = back_w - 40
    result_h = result_w / 1.5
    result_y = 312
    draw_cover_image(
        c,
        BEFORE_AFTER,
        result_x,
        result_y,
        result_w,
        result_h,
        focal_x=0.5,
        focal_y=0.5,
        contrast=1.0,
    )
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.rect(result_x, result_y, result_w, result_h, stroke=1, fill=0)
    draw_story(
        c,
        [
            P(
                "PRF EZ Gel under-eyes. One client's result; treatment plan, timing and response are individual.",
                "center_small",
            )
        ],
        back_x + 24,
        274,
        back_w - 48,
        29,
    )

    c.setFont("Cochin-Bold", 11.7)
    c.setFillColor(GOLD_DARK)
    c.drawCentredString(back_x + back_w / 2, 260, "Designed to look refreshed - not overdone.")
    draw_story(
        c,
        [
            P(
                "A consultation confirms whether injectable PRF, EZ Gel, topical PRF or another option best matches your goals.",
                "center_small",
            )
        ],
        back_x + 30,
        221,
        back_w - 60,
        34,
    )

    c.setFillColor(DEEP_BLUE)
    c.roundRect(back_x + 20, 83, back_w - 40, 126, 10, stroke=0, fill=1)
    c.setFillColor(GOLD_PALE)
    c.setFont("Avenir-Heavy", 7.2)
    c.drawString(back_x + 35, 187, "SCHEDULE A PRF CONSULTATION")
    c.setFillColor(WHITE)
    c.setFont("Cochin", 15.2)
    c.drawString(back_x + 35, 166, "A clear plan starts here.")
    c.setFont("Avenir-Medium", 8.1)
    c.drawString(back_x + 35, 144, "(844) 941-7673")
    c.drawString(back_x + 35, 129, "houseofrosefl.com/services/prf/")
    c.drawString(back_x + 35, 114, "525 E Olympia Ave, Unit 9")
    c.drawString(back_x + 35, 99, "Punta Gorda, FL 33950")
    draw_qr(c, "https://houseofrosefl.com/services/prf/", back_x + back_w - 86, 111, 47)

    legal = (
        "Individual results vary. No result, timing, duration, number of visits or candidacy is guaranteed. "
        "This brochure is educational and does not replace an individualized assessment."
    )
    draw_story(c, [P(legal, "center_small")], back_x + 28, 20, back_w - 56, 49)

    # Front cover: real storefront with restrained typography.
    cover_x, cover_w = PANEL_X[2], PANEL_W[2]
    draw_cover_image(
        c,
        EXTERIOR,
        cover_x,
        0,
        cover_w,
        PAGE_H,
        focal_x=0.48,
        focal_y=0.22,
        contrast=1.04,
    )
    c.setFillColor(Color(0.035, 0.04, 0.045, alpha=0.63))
    c.rect(cover_x, 0, cover_w, PAGE_H, stroke=0, fill=1)
    c.setFillColor(Color(0.06, 0.055, 0.045, alpha=0.28))
    c.rect(cover_x, 0, cover_w, PAGE_H * 0.49, stroke=0, fill=1)

    mono = ImageReader(str(MONOGRAM))
    c.drawImage(
        mono,
        cover_x + (cover_w - 94) / 2,
        PAGE_H - 174,
        width=94,
        height=94,
        mask="auto",
    )

    c.setFillColor(GOLD_PALE)
    c.setFont("Avenir-Medium", 7.6)
    c.drawCentredString(cover_x + cover_w / 2, PAGE_H - 197, "HOUSE OF ROSE AESTHETICS")
    draw_gold_rule(c, cover_x + 59, PAGE_H - 210, cover_w - 118)

    c.setFillColor(WHITE)
    c.setFont("Cochin", 31)
    c.drawCentredString(cover_x + cover_w / 2, 296, "PRF + EZ Gel")
    c.setFont("Cochin-Italic", 17.6)
    c.drawCentredString(cover_x + cover_w / 2, 273, "made from you")

    c.setFillColor(GOLD_PALE)
    c.setFont("Avenir-Heavy", 7.15)
    for idx, line in enumerate(
        ["INJECTABLE PRF", "EZ GEL BIO-FILLER", "MICRONEEDLING + TOPICAL PRF"]
    ):
        c.drawCentredString(cover_x + cover_w / 2, 227 - idx * 18, line)

    c.setFillColor(WHITE)
    c.setFont("Avenir", 9.2)
    c.drawCentredString(cover_x + cover_w / 2, 131, "Subtle renewal.")
    c.drawCentredString(cover_x + cover_w / 2, 116, "A carefully selected plan.")
    c.setFillColor(GOLD_PALE)
    c.setFont("Avenir-Medium", 7.5)
    c.drawCentredString(cover_x + cover_w / 2, 46, "ADVANCED AESTHETICS & WELLNESS - PUNTA GORDA")


def draw_inside(c: canvas.Canvas) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Real House of Rose interior, spanning the inside spread.
    banner_h = 112
    draw_cover_image(
        c,
        WELCOME,
        0,
        PAGE_H - banner_h,
        PAGE_W,
        banner_h,
        focal_x=0.5,
        focal_y=0.42,
        contrast=1.02,
    )
    c.setFillColor(Color(0.04, 0.035, 0.03, alpha=0.52))
    c.rect(0, PAGE_H - banner_h, PAGE_W, banner_h, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Cochin", 23.5)
    c.drawString(26, PAGE_H - 51, "PRF, designed around your goals.")
    c.setFillColor(GOLD_PALE)
    c.setFont("Avenir-Medium", 8.1)
    c.drawString(
        27,
        PAGE_H - 72,
        "CLIENT-DERIVED OPTIONS FOR SKIN QUALITY, DELICATE AREAS AND SUBTLE VOLUME",
    )

    # Very light visual separation at the fold locations.
    c.setStrokeColor(GOLD_PALE)
    c.setLineWidth(0.55)
    c.line(PANEL_X[1], 24, PANEL_X[1], PAGE_H - banner_h - 9)
    c.line(PANEL_X[2], 24, PANEL_X[2], PAGE_H - banner_h - 9)

    margin = 23
    content_y = 28
    content_h = PAGE_H - banner_h - 50

    # Inside left: plain-language explanation and preparation pathway.
    x, w = PANEL_X[0], PANEL_W[0]
    draw_story(
        c,
        [
            P("THE FOUNDATION", "panel_kicker"),
            P("What is PRF?", "panel_title"),
            P(
                "Platelet-rich fibrin (PRF) is prepared from a small sample of your own blood. After centrifugation, the platelet- and fibrin-rich portion is used the same day in a provider-directed aesthetic plan.",
                "body",
            ),
            P(
                "At House of Rose, PRF may remain liquid for an injectable treatment, be prepared into a soft EZ Gel, or be applied topically during a selected needling appointment.",
                "body",
            ),
            Spacer(1, 5),
            P("Why clients are drawn to PRF", "section_title"),
            P(
                "PRF is client-derived, personalized and designed for subtle change. Its fibrin-rich preparation supports a gradual approach that may help improve the appearance of fine lines, texture, tone and delicate under-eye concerns.",
                "body_tight",
            ),
            Spacer(1, 6),
            P("What makes it different", "section_title"),
            P(
                "Injectable PRF, EZ Gel and topical PRF are not interchangeable. They have different preparation, placement and provider requirements. PRF is also not the same as hyaluronic acid dermal filler.",
                "body_tight",
            ),
            Spacer(1, 5),
            P("A simple same-day pathway", "section_title"),
            P("<b>1.</b> Consultation and candidacy review", "bullet"),
            P("<b>2.</b> Small blood draw and centrifuge preparation", "bullet"),
            P("<b>3.</b> Provider-selected PRF format and placement", "bullet"),
            P("<b>4.</b> Written aftercare and individualized follow-up", "bullet"),
        ],
        x + margin,
        content_y,
        w - margin * 2,
        content_h,
    )

    # Inside center: the three House of Rose service lanes.
    x, w = PANEL_X[1], PANEL_W[1]
    services = [
        P("01  INJECTABLE PRF", "section_title"),
        P(
            "Liquid PRF is placed by a licensed medical provider in selected facial areas after consultation. It may be discussed for delicate under-eye concerns, the appearance of fine lines and overall skin quality when a subtle, gradual approach is appropriate.",
            "body_tight",
        ),
        Spacer(1, 5),
        P("02  EZ GEL BIO-FILLER", "section_title"),
        P(
            "Part of the PRF preparation is converted into a soft, client-derived gel. EZ Gel may be considered for subtle, temporary volume beneath the eyes, around smile lines or in other provider-selected areas. It is not a structural replacement for every dermal filler.",
            "body_tight",
        ),
        Spacer(1, 5),
        P("03  MICRONEEDLING + TOPICAL PRF", "section_title"),
        P(
            "PRF is applied to the skin surface as a topical adjunct during an appropriate needling service. This approach focuses on the appearance of texture, tone, fine lines and radiance. The PRF is not injected or delivered into the skin by the device.",
            "body_tight",
        ),
        Spacer(1, 7),
        P(
            "The right path depends on the concern, the treatment area, your health history, your preferences and the provider's assessment.",
            "small_ink",
        ),
    ]
    draw_story(
        c,
        [P("THREE CLEAR PATHS", "panel_kicker"), P("How we use PRF", "panel_title"), *services],
        x + margin,
        content_y,
        w - margin * 2,
        content_h,
    )

    # Inside right: benefits, experience and safety expectations.
    x, w = PANEL_X[2], PANEL_W[2]
    draw_story(
        c,
        [
            P("BENEFITS + EXPERIENCE", "panel_kicker"),
            P("What may improve", "panel_title"),
            P("<b>Under-eyes</b> - a smoother, more rested-looking appearance in a delicate area", "bullet"),
            P("<b>Fine lines</b> - softer-looking lines and refreshed-looking skin", "bullet"),
            P("<b>Texture + tone</b> - more even-looking skin quality and radiance", "bullet"),
            P("<b>Subtle volume</b> - temporary, natural-looking support with EZ Gel where appropriate", "bullet"),
            Spacer(1, 6),
            P("What your visit includes", "section_title"),
            P("<b>Before</b> - consultation, health-history review and treatment-area assessment", "bullet"),
            P("<b>During</b> - small blood draw, same-day preparation and the selected service", "bullet"),
            P("<b>After</b> - written care instructions, recovery guidance and follow-up timing", "bullet"),
            Spacer(1, 6),
            P("Results develop gradually", "section_title"),
            P(
                "Research on platelet concentrates in facial aesthetics is encouraging, but preparation methods, protocols and outcomes vary. More than one visit may be discussed, and any change may be gradual and temporary.",
                "body_tight",
            ),
            Spacer(1, 4),
            P("Not every client is a candidate.", "section_title"),
            P(
                "Medications, bleeding or clotting history, active skin concerns, pregnancy or breastfeeding, immune status and other health factors may change or delay the plan. Your provider makes the final decision after assessment.",
                "body_tight",
            ),
        ],
        x + margin,
        content_y,
        w - margin * 2,
        content_h,
    )


def build_pdf() -> None:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle("House of Rose Aesthetics - PRF and EZ Gel Tri-Fold Brochure")
    c.setAuthor("House of Rose Aesthetics")
    c.setSubject(
        "Benefit-led customer education for injectable PRF, EZ Gel bio-filler, and microneedling with topical PRF"
    )
    c.setKeywords("PRF, EZ Gel, bio-filler, microneedling, House of Rose, Punta Gorda")

    draw_outside(c)
    c.showPage()
    draw_inside(c)
    c.showPage()
    c.save()


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
