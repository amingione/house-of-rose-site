from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont
from reportlab.graphics.barcode import qr
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "output" / "pdf" / "prf-evidence-guide"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 3300, 2550
PANEL = 1100
MARGIN = 78

IVORY = "#F8F3EB"
CREAM = "#EFE3D3"
PAPER = "#FFFCF7"
ESPRESSO = "#261B17"
INK = "#302722"
TAUPE = "#6D6057"
GOLD = "#B78B45"
CHAMPAGNE = "#DDBE7A"
BLUSH = "#D5B5A5"
SAGE = "#777963"
WHITE = "#FFFDF9"
MIST = "#E8DDD0"
ROSE = "#A86765"

SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
SANS_ITALIC = "/System/Library/Fonts/Supplemental/Arial Italic.ttf"

HERO = Path(
    "/Users/ambermingione/.codex/generated_images/"
    "019fa3de-cbd5-7370-984d-49bd48cd9e13/call_tuToslPetXfWrWTzBO7dmlcf.png"
)
BEFORE_AFTER = ROOT / "packages/web/public/images/before-after/PRF/prf-undereyes-ezgel.png"
MONOGRAM = ROOT / "packages/web/public/logos/house-of-rose-monogram/hr-monogram-gold.png"
ROOM = ROOT / "packages/web/src/assets/images/house-of-rose-treatment-room.png"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def fit_crop(
    image: Image.Image,
    size: tuple[int, int],
    focus_x: float = 0.5,
    focus_y: float = 0.5,
) -> Image.Image:
    image = image.convert("RGB")
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    new_w, new_h = int(image.width * scale), int(image.height * scale)
    image = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = max(0, min(new_w - target_w, int((new_w - target_w) * focus_x)))
    top = max(0, min(new_h - target_h, int((new_h - target_h) * focus_y)))
    return image.crop((left, top, left + target_w, top + target_h))


def rounded_paste(
    base: Image.Image,
    image: Image.Image,
    box: tuple[int, int, int, int],
    radius: int = 28,
    focus_x: float = 0.5,
    focus_y: float = 0.5,
) -> None:
    x0, y0, x1, y1 = box
    fitted = fit_crop(image, (x1 - x0, y1 - y0), focus_x, focus_y)
    mask = Image.new("L", fitted.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, fitted.width, fitted.height), radius=radius, fill=255
    )
    base.paste(fitted, (x0, y0), mask)


def wrap_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    width: int,
) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split()
        current = words[0]
        for word in words[1:]:
            candidate = f"{current} {word}"
            if draw.textlength(candidate, font=fnt) <= width:
                current = candidate
            else:
                lines.append(current)
                current = word
        lines.append(current)
    return lines


def text_block(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    width: int,
    spacing: int = 9,
    align: str = "left",
) -> int:
    x, y = xy
    lines = wrap_lines(draw, text, fnt, width)
    ascent, descent = fnt.getmetrics()
    line_h = ascent + descent + spacing
    for line in lines:
        if line:
            line_w = draw.textlength(line, font=fnt)
            tx = x
            if align == "center":
                tx = x + (width - line_w) / 2
            elif align == "right":
                tx = x + width - line_w
            draw.text((tx, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def tracking_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    tracking: int,
) -> None:
    x, y = xy
    for character in text:
        draw.text((x, y), character, font=fnt, fill=fill)
        x += int(draw.textlength(character, font=fnt)) + tracking


def label(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    fill: str = GOLD,
) -> int:
    tracking_text(draw, (x, y), text.upper(), font(SANS_BOLD, 25), fill, 3)
    return y + 43


def rule(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    fill: str = GOLD,
    weight: int = 3,
) -> None:
    draw.line((x, y, x + width, y), fill=fill, width=weight)


def bullets(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    items: list[str],
    width: int,
    fnt: ImageFont.FreeTypeFont,
    gap: int = 9,
    dot_fill: str = GOLD,
    text_fill: str = INK,
) -> int:
    for item in items:
        draw.ellipse((x, y + 14, x + 10, y + 24), fill=dot_fill)
        y = text_block(
            draw,
            (x + 27, y),
            item,
            fnt,
            text_fill,
            width - 27,
            spacing=7,
        )
        y += gap
    return y


def qr_image(value: str, pixels: int = 320) -> Image.Image:
    widget = qr.QrCodeWidget(value)
    widget.qr.make()
    modules = widget.qr.modules
    count = widget.qr.moduleCount
    quiet = 4
    total = count + quiet * 2
    unit = max(1, pixels // total)
    actual = total * unit
    image = Image.new("RGB", (actual, actual), WHITE)
    draw = ImageDraw.Draw(image)
    for row, values in enumerate(modules):
        for column, dark in enumerate(values):
            if dark:
                x0 = (column + quiet) * unit
                y0 = (row + quiet) * unit
                draw.rectangle(
                    (x0, y0, x0 + unit - 1, y0 + unit - 1),
                    fill=ESPRESSO,
                )
    return image.resize((pixels, pixels), Image.Resampling.NEAREST)


def add_fold_marks(draw: ImageDraw.ImageDraw) -> None:
    for x in (PANEL, PANEL * 2):
        draw.line((x, 0, x, 34), fill="#A99272", width=3)
        draw.line((x, H - 34, x, H), fill="#A99272", width=3)


def draw_compare_row(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    heading: str,
    prp: str,
    prf: str,
) -> int:
    draw.text((x, y), heading.upper(), font=font(SANS_BOLD, 23), fill=GOLD)
    y += 42
    draw.rounded_rectangle(
        (x, y, x + 438, y + 128),
        radius=18,
        fill="#FAF5EE",
        outline="#D7C6B4",
        width=2,
    )
    draw.rounded_rectangle(
        (x + 456, y, x + 892, y + 128),
        radius=18,
        fill="#E7D8C5",
        outline="#CEB17C",
        width=2,
    )
    draw.text((x + 18, y + 14), "PRP", font=font(SANS_BOLD, 23), fill=TAUPE)
    text_block(
        draw,
        (x + 18, y + 47),
        prp,
        font(SANS, 25),
        INK,
        402,
        spacing=5,
    )
    draw.text((x + 474, y + 14), "PRF", font=font(SANS_BOLD, 23), fill=GOLD)
    text_block(
        draw,
        (x + 474, y + 47),
        prf,
        font(SANS_BOLD, 25),
        ESPRESSO,
        400,
        spacing=5,
    )
    return y + 152


def make_outside() -> Image.Image:
    image = Image.new("RGB", (W, H), IVORY)
    draw = ImageDraw.Draw(image)

    # Back panel: consultation and practical information.
    draw.rectangle((0, 0, PANEL, H), fill=ESPRESSO)
    room = fit_crop(Image.open(ROOM), (PANEL, 515), 0.42, 0.40)
    room = ImageEnhance.Color(room).enhance(0.50)
    room = ImageEnhance.Brightness(room).enhance(0.62)
    image.paste(room, (0, 0))
    shade = Image.new("RGBA", (PANEL, 515), (38, 26, 21, 128))
    image.paste(shade, (0, 0), shade)

    monogram = Image.open(MONOGRAM).convert("RGBA")
    monogram.thumbnail((190, 190), Image.Resampling.LANCZOS)
    image.paste(monogram, (MARGIN, 55), monogram)
    draw = ImageDraw.Draw(image)
    draw.text(
        (MARGIN + 210, 74),
        "HOUSE OF ROSE",
        font=font(SERIF_BOLD, 48),
        fill=WHITE,
    )
    tracking_text(
        draw,
        (MARGIN + 215, 145),
        "A E S T H E T I C S",
        font(SANS, 21),
        CHAMPAGNE,
        3,
    )

    y = 585
    y = label(draw, MARGIN, y, "Your consultation")
    y = text_block(
        draw,
        (MARGIN, y),
        "Which PRF path fits your face?",
        font(SERIF_BOLD, 56),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=8,
    )
    y += 20
    y = text_block(
        draw,
        (MARGIN, y),
        "We assess your goals, anatomy, health history and timeline, then recommend injectable PRF, PRF EZ Gel, topical PRF with needling, or another option if it better fits your concern.",
        font(SANS, 29),
        "#E9DDD2",
        PANEL - 2 * MARGIN,
        spacing=8,
    )
    y += 25

    draw.rounded_rectangle(
        (MARGIN, y, PANEL - MARGIN, y + 450),
        radius=28,
        fill="#34251F",
        outline="#80684F",
        width=2,
    )
    box_y = y + 28
    draw.text(
        (MARGIN + 30, box_y),
        "WHAT TO EXPECT",
        font=font(SANS_BOLD, 25),
        fill=CHAMPAGNE,
    )
    box_y += 48
    box_y = bullets(
        draw,
        MARGIN + 30,
        box_y,
        [
            "Small same-day blood draw and individualized preparation",
            "Numbing may be used, depending on the treatment",
            "Temporary redness, swelling, tenderness or bruising",
            "Visible change develops progressively; timing varies",
            "A short series may be recommended for some goals",
        ],
        PANEL - 2 * MARGIN - 60,
        font(SANS, 27),
        gap=5,
        dot_fill=CHAMPAGNE,
        text_fill=WHITE,
    )
    draw.line(
        (MARGIN + 30, y + 322, PANEL - MARGIN - 30, y + 322),
        fill="#6F5848",
        width=2,
    )
    draw.text(
        (MARGIN + 30, y + 340),
        "TELL YOUR PROVIDER ABOUT",
        font=font(SANS_BOLD, 21),
        fill=CHAMPAGNE,
    )
    text_block(
        draw,
        (MARGIN + 30, y + 376),
        "blood thinners, platelet or bleeding conditions, active infection, pregnancy or breastfeeding, and keloid history for needling.",
        font(SANS, 21),
        WHITE,
        PANEL - 2 * MARGIN - 60,
        spacing=4,
    )
    y += 480

    qr_code = qr_image("https://houseofrosefl.com/services/prf/", 292)
    qr_box = Image.new("RGB", (328, 328), WHITE)
    qr_box.paste(qr_code, (18, 18))
    image.paste(qr_box, (MARGIN, y))
    draw = ImageDraw.Draw(image)
    text_x = MARGIN + 360
    draw.text(
        (text_x, y + 6),
        "CALL OR TEXT",
        font=font(SANS_BOLD, 24),
        fill=CHAMPAGNE,
    )
    draw.text(
        (text_x, y + 48),
        "(844) 941-ROSE",
        font=font(SANS_BOLD, 35),
        fill=WHITE,
    )
    draw.text(
        (text_x, y + 108),
        "Scan for PRF details\nand consultation.",
        font=font(SANS, 27),
        fill="#E9DDD2",
        spacing=7,
    )
    draw.text(
        (text_x, y + 206),
        "Walk-ins welcome;\nappointments recommended.",
        font=font(SANS_ITALIC, 23),
        fill="#CDBDB1",
        spacing=6,
    )

    legal_y = 2135
    rule(draw, MARGIN, legal_y, PANEL - 2 * MARGIN, CHAMPAGNE, 2)
    draw.text(
        (MARGIN, legal_y + 25),
        "525 E Olympia Ave, Unit 9 | Punta Gorda, FL 33950",
        font=font(SANS, 24),
        fill=WHITE,
    )
    draw.text(
        (MARGIN, legal_y + 68),
        "info@houseofrosefl.com | houseofrosefl.com/services/prf/",
        font=font(SANS, 23),
        fill="#D6C9BF",
    )
    draw.text(
        (MARGIN, legal_y + 117),
        "Medical Director: Joshua Shaw, MD | FL Lic. ME136232",
        font=font(SANS_BOLD, 24),
        fill=CHAMPAGNE,
    )
    text_block(
        draw,
        (MARGIN, legal_y + 166),
        "Not every client is a candidate. Injectable PRF and PRF EZ Gel are RN-performed under medical direction; topical PRF is surface-applied during a selected needling service. Final treatment and timing are confirmed after assessment. Individual outcomes vary.",
        font(SANS, 20),
        "#BFAFA4",
        PANEL - 2 * MARGIN,
        spacing=4,
    )

    # Fold-in panel: PRF vs PRP plus real result.
    x0 = PANEL
    draw.rectangle((x0, 0, x0 + PANEL, H), fill=CREAM)
    y = 82
    y = label(draw, x0 + MARGIN, y, "Why PRF is different")
    y = text_block(
        draw,
        (x0 + MARGIN, y),
        "A fibrin scaffold.\nA slower signal.",
        font(SERIF_BOLD, 57),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=7,
    )
    y += 15
    y = text_block(
        draw,
        (x0 + MARGIN, y),
        "Both PRP and PRF are made from your own blood. PRF is prepared without an added anticoagulant, allowing a natural fibrin matrix to form around platelets and signaling proteins.",
        font(SANS, 28),
        INK,
        PANEL - 2 * MARGIN,
        spacing=7,
    )
    y += 20
    y = draw_compare_row(
        draw,
        x0 + MARGIN,
        y,
        "Preparation",
        "Usually includes an anticoagulant.",
        "Prepared without an added anticoagulant.",
    )
    y = draw_compare_row(
        draw,
        x0 + MARGIN,
        y,
        "Structure",
        "Primarily a platelet-rich liquid.",
        "Forms a fibrin network that can remain liquid or become gel-like.",
    )
    y = draw_compare_row(
        draw,
        x0 + MARGIN,
        y,
        "Release pattern",
        "Stronger early release in laboratory testing.",
        "More gradual release over up to 10 days in one lab study.",
    )

    y += 5
    draw.rounded_rectangle(
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 260),
        radius=25,
        fill="#E1D0BB",
        outline="#C8A66B",
        width=2,
    )
    draw.text(
        (x0 + MARGIN + 28, y + 24),
        "WHY THAT MATTERS",
        font=font(SANS_BOLD, 24),
        fill=GOLD,
    )
    text_block(
        draw,
        (x0 + MARGIN + 28, y + 68),
        "The fibrin network is the biologic reason PRF is studied for gradual signaling, skin-quality support and soft client-derived gel applications. Mechanism evidence explains potential - it does not guarantee a visible result.",
        font(SANS, 26),
        ESPRESSO,
        PANEL - 2 * MARGIN - 56,
        spacing=6,
    )
    y += 292

    rounded_paste(
        image,
        Image.open(BEFORE_AFTER),
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 505),
        25,
    )
    draw = ImageDraw.Draw(image)
    y += 523
    draw.text(
        (x0 + MARGIN, y),
        "PRF EZ Gel under-eyes",
        font=font(SERIF_BOLD, 35),
        fill=ESPRESSO,
    )
    y += 48
    text_block(
        draw,
        (x0 + MARGIN, y),
        "One client's individual result. Treatment plan, timing and response vary.",
        font(SANS_ITALIC, 21),
        TAUPE,
        PANEL - 2 * MARGIN,
        spacing=4,
    )
    signal_y = 2035
    draw.rounded_rectangle(
        (x0 + MARGIN, signal_y, x0 + PANEL - MARGIN, signal_y + 355),
        radius=25,
        fill="#E1D0BB",
        outline="#C8A66B",
        width=2,
    )
    draw.text(
        (x0 + MARGIN + 28, signal_y + 24),
        "THE SIGNALING PROTEINS STUDIED IN PRF",
        font=font(SANS_BOLD, 22),
        fill=GOLD,
    )
    tracking_text(
        draw,
        (x0 + MARGIN + 28, signal_y + 74),
        "PDGF  |  TGF-BETA  |  VEGF  |  EGF  |  IGF",
        font(SANS_BOLD, 22),
        ESPRESSO,
        1,
    )
    text_block(
        draw,
        (x0 + MARGIN + 28, signal_y + 122),
        "These factors are studied for roles in cell migration, collagen-related signaling, microvascular activity and tissue-repair processes. Their presence supports the biologic rationale; it does not guarantee a cosmetic outcome.",
        font(SANS, 24),
        INK,
        PANEL - 2 * MARGIN - 56,
        spacing=5,
    )

    # Front cover.
    x0 = PANEL * 2
    hero = fit_crop(Image.open(HERO), (PANEL, H), 0.73, 0.46)
    hero = ImageEnhance.Color(hero).enhance(0.86)
    image.paste(hero, (x0, 0))
    overlay = Image.new("RGBA", (PANEL, H), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for yy in range(H):
        alpha = int(25 + 175 * max(0, (yy / H - 0.38) / 0.62))
        overlay_draw.line((0, yy, PANEL, yy), fill=(34, 23, 19, alpha))
    image.paste(overlay, (x0, 0), overlay)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(
        (x0 + 64, 65, x0 + PANEL - 64, 302),
        radius=26,
        fill=(248, 243, 235, 224),
    )
    monogram = Image.open(MONOGRAM).convert("RGBA")
    monogram.thumbnail((170, 170), Image.Resampling.LANCZOS)
    image.paste(monogram, (x0 + 102, 96), monogram)
    draw = ImageDraw.Draw(image)
    draw.text(
        (x0 + 298, 107),
        "HOUSE OF ROSE",
        font=font(SERIF_BOLD, 49),
        fill=ESPRESSO,
    )
    tracking_text(
        draw,
        (x0 + 303, 177),
        "A E S T H E T I C S",
        font(SANS, 22),
        GOLD,
        3,
    )

    cover_y = 1395
    draw.text(
        (x0 + MARGIN, cover_y),
        "THE PRF FACIAL AESTHETICS GUIDE",
        font=font(SANS_BOLD, 25),
        fill=CHAMPAGNE,
    )
    cover_y += 62
    cover_y = text_block(
        draw,
        (x0 + MARGIN, cover_y),
        "Your skin.\nYour biology.\nYour refresh.",
        font(SERIF_BOLD, 71),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=6,
    )
    cover_y += 24
    cover_y = text_block(
        draw,
        (x0 + MARGIN, cover_y),
        "A highly personal approach to refreshed under-eyes, smoother-looking texture, luminous skin quality and subtle volume.",
        font(SANS_BOLD, 31),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=8,
    )
    cover_y += 28
    rule(draw, x0 + MARGIN, cover_y, 220, CHAMPAGNE, 4)
    cover_y += 32
    text_block(
        draw,
        (x0 + MARGIN, cover_y),
        "INJECTABLE PRF | PRF EZ GEL | TOPICAL PRF + NEEDLING",
        font(SANS_BOLD, 21),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=5,
    )
    draw.text(
        (x0 + MARGIN, 2403),
        "EVIDENCE-INFORMED | MODEL SHOWN | INDIVIDUAL OUTCOMES VARY",
        font=font(SANS, 17),
        fill="#E8DAD0",
    )

    add_fold_marks(draw)
    return image


def benefit_card(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    title: str,
    body: str,
    color: str,
) -> int:
    draw.rounded_rectangle(
        (x, y, x + 930, y + 190),
        radius=24,
        fill=PAPER,
        outline="#DED0C0",
        width=2,
    )
    draw.rounded_rectangle(
        (x + 18, y + 18, x + 75, y + 172),
        radius=18,
        fill=color,
    )
    draw.text(
        (x + 100, y + 24),
        title,
        font=font(SERIF_BOLD, 34),
        fill=ESPRESSO,
    )
    text_block(
        draw,
        (x + 100, y + 78),
        body,
        font(SANS, 25),
        INK,
        800,
        spacing=6,
    )
    return y + 210


def path_card(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    number: str,
    title: str,
    body: str,
    best: str,
) -> int:
    draw.rounded_rectangle(
        (x, y, x + 930, y + 396),
        radius=26,
        fill=PAPER,
        outline="#D8C3A1",
        width=2,
    )
    draw.ellipse((x + 24, y + 24, x + 92, y + 92), fill=ESPRESSO)
    draw.text(
        (x + 45, y + 37),
        number,
        font=font(SANS_BOLD, 28),
        fill=CHAMPAGNE,
    )
    draw.text(
        (x + 116, y + 33),
        title,
        font=font(SANS_BOLD, 30),
        fill=GOLD,
    )
    text_y = text_block(
        draw,
        (x + 28, y + 112),
        body,
        font(SANS, 27),
        INK,
        874,
        spacing=7,
    )
    draw.line((x + 28, text_y + 12, x + 902, text_y + 12), fill="#DDD0BF", width=2)
    text_block(
        draw,
        (x + 28, text_y + 30),
        f"BEST FIT: {best}",
        font(SANS_BOLD, 23),
        ESPRESSO,
        874,
        spacing=5,
    )
    return y + 420


def study_card(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    year: str,
    study_type: str,
    finding: str,
    caution: str,
) -> int:
    draw.rounded_rectangle(
        (x, y, x + 930, y + 368),
        radius=25,
        fill=PAPER,
        outline="#D8C9B8",
        width=2,
    )
    draw.rounded_rectangle(
        (x + 22, y + 22, x + 146, y + 82),
        radius=20,
        fill=ESPRESSO,
    )
    draw.text(
        (x + 48, y + 33),
        year,
        font=font(SANS_BOLD, 27),
        fill=CHAMPAGNE,
    )
    draw.text(
        (x + 166, y + 31),
        study_type.upper(),
        font=font(SANS_BOLD, 23),
        fill=GOLD,
    )
    body_y = text_block(
        draw,
        (x + 26, y + 108),
        finding,
        font(SANS, 25),
        INK,
        878,
        spacing=6,
    )
    draw.line((x + 26, body_y + 11, x + 904, body_y + 11), fill="#E1D5C6", width=2)
    draw.text(
        (x + 26, body_y + 29),
        "READ IT CORRECTLY",
        font=font(SANS_BOLD, 21),
        fill=ROSE,
    )
    text_block(
        draw,
        (x + 26, body_y + 65),
        caution,
        font(SANS_ITALIC, 22),
        TAUPE,
        878,
        spacing=5,
    )
    return y + 388


def make_inside() -> Image.Image:
    image = Image.new("RGB", (W, H), IVORY)
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 0, W, 325), fill=ESPRESSO)
    draw.text(
        (85, 55),
        "PRF is not one treatment. It is a personalized family of options.",
        font=font(SERIF_BOLD, 64),
        fill=WHITE,
    )
    draw.text(
        (88, 150),
        "BENEFITS BY CONCERN  |  THREE TREATMENT PATHS  |  FOUR RESEARCH SNAPSHOTS",
        font=font(SANS_BOLD, 27),
        fill=CHAMPAGNE,
    )
    draw.text(
        (88, 215),
        "The most persuasive plan is the one built around what you want to improve - and what the evidence can honestly support.",
        font=font(SERIF_ITALIC, 29),
        fill="#E8DCD3",
    )

    # Left panel: complete benefit picture.
    x0 = 0
    y = 390
    y = label(draw, x0 + MARGIN, y, "What clients want to see")
    y = text_block(
        draw,
        (x0 + MARGIN, y),
        "The visible benefits,\nmatched to the concern.",
        font(SERIF_BOLD, 48),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=7,
    )
    y += 18
    y = benefit_card(
        draw,
        x0 + MARGIN,
        y,
        "Brighter-looking under-eyes",
        "May soften a tired, shadowed or crepey look and improve the appearance of fine lines. True pigment may not respond.",
        GOLD,
    )
    y = benefit_card(
        draw,
        x0 + MARGIN,
        y,
        "Smoother-looking texture",
        "Supports a refined look to uneven texture, enlarged-looking pores and select shallow or rolling scar appearance when paired with needling.",
        SAGE,
    )
    y = benefit_card(
        draw,
        x0 + MARGIN,
        y,
        "Luminous skin quality",
        "Chosen for gradual-looking improvement in radiance, tone, softness, elasticity and the appearance of fine lines.",
        BLUSH,
    )
    y = benefit_card(
        draw,
        x0 + MARGIN,
        y,
        "Subtle temporary volume",
        "PRF EZ Gel can add soft support in selected delicate areas without synthetic filler material. It is not a full replacement for structural filler.",
        ROSE,
    )
    y += 10
    draw.rounded_rectangle(
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 405),
        radius=26,
        fill="#E8DCCA",
        outline="#D1B98E",
        width=2,
    )
    draw.text(
        (x0 + MARGIN + 28, y + 24),
        "WHY CLIENTS CHOOSE PRF",
        font=font(SANS_BOLD, 24),
        fill=GOLD,
    )
    bullets(
        draw,
        x0 + MARGIN + 28,
        y + 70,
        [
            "Client-derived and prepared the day of treatment",
            "No synthetic filler material in PRF or PRF EZ Gel",
            "Very low allergy or rejection risk",
            "Gradual, natural-looking change rather than an overdone look",
            "Flexible: liquid, gel or topical use based on the goal",
        ],
        PANEL - 2 * MARGIN - 56,
        font(SANS, 25),
        gap=4,
    )

    candidate_y = 1880
    draw.rounded_rectangle(
        (
            x0 + MARGIN,
            candidate_y,
            x0 + PANEL - MARGIN,
            candidate_y + 465,
        ),
        radius=26,
        fill=ESPRESSO,
    )
    draw.text(
        (x0 + MARGIN + 28, candidate_y + 24),
        "IS PRF RIGHT FOR ME?",
        font=font(SANS_BOLD, 24),
        fill=CHAMPAGNE,
    )
    draw.text(
        (x0 + MARGIN + 28, candidate_y + 72),
        "OFTEN A GOOD FIT",
        font=font(SANS_BOLD, 20),
        fill=CHAMPAGNE,
    )
    text_block(
        draw,
        (x0 + MARGIN + 28, candidate_y + 108),
        "Generally healthy adults seeking gradual, natural-looking refinement and willing to accept temporary swelling or bruising.",
        font(SANS, 23),
        WHITE,
        PANEL - 2 * MARGIN - 56,
        spacing=5,
    )
    draw.line(
        (
            x0 + MARGIN + 28,
            candidate_y + 226,
            x0 + PANEL - MARGIN - 28,
            candidate_y + 226,
        ),
        fill="#6F5848",
        width=2,
    )
    draw.text(
        (x0 + MARGIN + 28, candidate_y + 247),
        "WE MAY PAUSE OR ADAPT",
        font=font(SANS_BOLD, 20),
        fill=CHAMPAGNE,
    )
    text_block(
        draw,
        (x0 + MARGIN + 28, candidate_y + 283),
        "Active infection or breakout, certain platelet or bleeding disorders, anticoagulant use, pregnancy or breastfeeding, or keloid history for needling. Your provider confirms candidacy.",
        font(SANS, 23),
        WHITE,
        PANEL - 2 * MARGIN - 56,
        spacing=5,
    )

    # Middle panel: treatment paths and timeline.
    x0 = PANEL
    draw.rectangle((x0, 325, x0 + PANEL, H), fill=CREAM)
    y = 390
    y = label(draw, x0 + MARGIN, y, "Three treatment paths")
    y = text_block(
        draw,
        (x0 + MARGIN, y),
        "Same biology.\nDifferent delivery.",
        font(SERIF_BOLD, 48),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=7,
    )
    y += 18
    y = path_card(
        draw,
        x0 + MARGIN,
        y,
        "1",
        "INJECTABLE PRF",
        "Liquid PRF is placed in select facial areas by a registered nurse under medical direction. It is used for targeted skin-quality goals and delicate under-eye concerns.",
        "Crepey under-eyes, fine-line appearance, targeted refinement.",
    )
    y = path_card(
        draw,
        x0 + MARGIN,
        y,
        "2",
        "PRF EZ GEL",
        "PRF is gently processed into a soft, client-derived gel. It offers immediate temporary support plus a gradual-looking skin-quality response.",
        "Subtle volume where a softer alternative to synthetic filler is preferred.",
    )
    y = path_card(
        draw,
        x0 + MARGIN,
        y,
        "3",
        "TOPICAL PRF + NEEDLING",
        "Fluid PRF is applied to the skin surface during selected microneedling or microchanneling. It is topical - not injected - and does not add volume.",
        "Texture, radiance, fine lines, pore appearance and select shallow scars.",
    )

    y += 5
    draw.rounded_rectangle(
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 450),
        radius=26,
        fill=ESPRESSO,
    )
    draw.text(
        (x0 + MARGIN + 28, y + 25),
        "A REALISTIC TIMELINE",
        font=font(SANS_BOLD, 24),
        fill=CHAMPAGNE,
    )
    timeline = [
        ("DAY 0-3", "Temporary swelling, redness, tenderness or bruising may be most noticeable."),
        ("WEEKS 1-6", "Early changes may become visible progressively; the pace varies by treatment and person."),
        ("MONTHS AHEAD", "The plan may include a short series and individualized maintenance rather than one-and-done promises."),
    ]
    timeline_y = y + 73
    for marker, body in timeline:
        draw.text(
            (x0 + MARGIN + 28, timeline_y),
            marker,
            font=font(SANS_BOLD, 21),
            fill=CHAMPAGNE,
        )
        timeline_y = text_block(
            draw,
            (x0 + MARGIN + 245, timeline_y - 2),
            body,
            font(SANS, 23),
            WHITE,
            PANEL - 2 * MARGIN - 273,
            spacing=5,
        )
        timeline_y += 15

    # Right panel: research.
    x0 = PANEL * 2
    y = 390
    y = label(draw, x0 + MARGIN, y, "What the research says")
    y = text_block(
        draw,
        (x0 + MARGIN, y),
        "Encouraging evidence.\nHonest interpretation.",
        font(SERIF_BOLD, 48),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=7,
    )
    y += 18
    y = study_card(
        draw,
        x0 + MARGIN,
        y,
        "2024",
        "Review | 96 selected articles",
        "Davies and Miron reported generally favorable outcomes across autologous platelet concentrates for texture, tone, elasticity, fine lines and wrinkles, with treatments generally well tolerated.",
        "The review includes PRP, PRF and related concentrates; most published studies were PRP. Small samples and nonstandard protocols limit certainty.",
    )
    y = study_card(
        draw,
        x0 + MARGIN,
        y,
        "2021",
        "Randomized split-face trial | n=30",
        "Hu and colleagues compared PRFM with saline. At 6 weeks, overall objective skin-quality scores favored PRFM; texture was the only individual parameter with a significant between-group difference.",
        "Spots, fine rhytids and pores were not proven to differ; persistence beyond 6 weeks after one treatment was inconclusive.",
    )
    y = study_card(
        draw,
        x0 + MARGIN,
        y,
        "2016",
        "Laboratory release study | 6 donors",
        "Kobayashi and colleagues found PRP released more growth factors early, while PRF and A-PRF showed a more gradual release pattern over 10 days.",
        "This explains biologic rationale. It was not a facial-outcome trial and cannot predict an individual's visible result.",
    )
    y = study_card(
        draw,
        x0 + MARGIN,
        y,
        "2022",
        "Under-eye split-face trial | n=40",
        "Diab and colleagues studied two sessions of PRP versus plasma gel. Both improved periorbital wrinkles; the gel side performed better. Neither reduced measured pigmentation.",
        "The plasma-gel protocol is not identical to every PRF EZ Gel system, and improvement was not maintained through the following 3 months.",
    )

    y += 4
    draw.rounded_rectangle(
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 315),
        radius=25,
        fill="#E9D9C6",
        outline="#CBAF81",
        width=2,
    )
    draw.text(
        (x0 + MARGIN + 27, y + 23),
        "THE TRUST-BUILDING BOTTOM LINE",
        font=font(SANS_BOLD, 23),
        fill=GOLD,
    )
    text_block(
        draw,
        (x0 + MARGIN + 27, y + 66),
        "PRF is promising, personalized and biologically compelling - but not magic. The strongest reason to choose it is a qualified provider who matches the preparation and delivery method to your anatomy, goal and tolerance for gradual change.",
        font(SERIF_BOLD, 27),
        ESPRESSO,
        PANEL - 2 * MARGIN - 54,
        spacing=6,
    )

    add_fold_marks(draw)
    return image


def save_pdf(outside: Image.Image, inside: Image.Image) -> Path:
    pdf_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Tri-Fold.pdf"
    outside_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Outside.png"
    inside_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Inside.png"
    document = canvas.Canvas(str(pdf_path), pagesize=landscape(letter))
    page_w, page_h = landscape(letter)
    for page in (outside_path, inside_path):
        document.drawImage(
            str(page),
            0,
            0,
            width=page_w,
            height=page_h,
            preserveAspectRatio=False,
            mask="auto",
        )
        document.showPage()
    document.setTitle("House of Rose PRF Facial Aesthetics Evidence Guide")
    document.setAuthor("House of Rose Aesthetics")
    document.setSubject("Evidence-informed PRF facial aesthetics tri-fold brochure")
    document.save()
    return pdf_path


def write_copy_deck() -> Path:
    copy_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Copy-and-Sources.md"
    copy_path.write_text(
        """# House of Rose PRF Facial Aesthetics Evidence Guide

## Purpose

This copy deck accompanies the two-sided tri-fold brochure. It preserves the exact
consumer-facing copy, evidence interpretation and full references used in the design.

## Front cover

**The PRF Facial Aesthetics Guide**

**Your skin. Your biology. Your refresh.**

A highly personal approach to refreshed under-eyes, smoother-looking texture,
luminous skin quality and subtle volume.

Injectable PRF | PRF EZ Gel | Topical PRF + Needling

Evidence-informed | Model shown | Individual outcomes vary

## Outside fold-in panel

### Why PRF is different

**A fibrin scaffold. A slower signal.**

Both PRP and PRF are made from your own blood. PRF is prepared without an added
anticoagulant, allowing a natural fibrin matrix to form around platelets and
signaling proteins.

| | PRP | PRF |
|---|---|---|
| Preparation | Usually includes an anticoagulant. | Prepared without an added anticoagulant. |
| Structure | Primarily a platelet-rich liquid. | Forms a fibrin network that can remain liquid or become gel-like. |
| Release pattern | Stronger early release in laboratory testing. | More gradual release over up to 10 days in one lab study. |

**Why that matters**

The fibrin network is the biologic reason PRF is studied for gradual signaling,
skin-quality support and soft client-derived gel applications. Mechanism evidence
explains potential - it does not guarantee a visible result.

## Inside: benefits

### Brighter-looking under-eyes

May soften a tired, shadowed or crepey look and improve the appearance of fine
lines. True pigment may not respond.

### Smoother-looking texture

Supports a refined look to uneven texture, enlarged-looking pores and select
shallow or rolling scar appearance when paired with needling.

### Luminous skin quality

Chosen for gradual-looking improvement in radiance, tone, softness, elasticity
and the appearance of fine lines.

### Subtle temporary volume

PRF EZ Gel can add soft support in selected delicate areas without synthetic
filler material. It is not a full replacement for structural filler.

### Why clients choose PRF

- Client-derived and prepared the day of treatment
- No synthetic filler material in PRF or PRF EZ Gel
- Very low allergy or rejection risk
- Gradual, natural-looking change rather than an overdone look
- Flexible: liquid, gel or topical use based on the goal

### Is PRF right for me?

Often a good fit: generally healthy adults seeking gradual, natural-looking
refinement and willing to accept temporary swelling or bruising.

We may pause or adapt for active infection or breakout, certain platelet or
bleeding disorders, anticoagulant use, pregnancy or breastfeeding, or keloid
history for needling. Your provider confirms candidacy.

## Inside: treatment paths

### Injectable PRF

Liquid PRF is placed in select facial areas by a registered nurse under medical
direction. It is used for targeted skin-quality goals and delicate under-eye
concerns.

Best fit: crepey under-eyes, fine-line appearance, targeted refinement.

### PRF EZ Gel

PRF is gently processed into a soft, client-derived gel. It offers immediate
temporary support plus a gradual-looking skin-quality response.

Best fit: subtle volume where a softer alternative to synthetic filler is preferred.

### Topical PRF + Needling

Fluid PRF is applied to the skin surface during selected microneedling or
microchanneling. It is topical - not injected - and does not add volume.

Best fit: texture, radiance, fine lines, pore appearance and select shallow scars.

## Inside: study snapshots

### 2024 review - 96 selected articles

Davies and Miron reported generally favorable outcomes across autologous platelet
concentrates for texture, tone, elasticity, fine lines and wrinkles, with treatments
generally well tolerated.

Read it correctly: The review includes PRP, PRF and related concentrates; most
published studies were PRP. Small samples and nonstandard protocols limit certainty.

### 2021 randomized split-face trial - 30 participants

Hu and colleagues compared PRFM with saline. At 6 weeks, overall objective
skin-quality scores favored PRFM; texture was the only individual parameter with a
significant between-group difference.

Read it correctly: Spots, fine rhytids and pores were not proven to differ;
persistence beyond 6 weeks after one treatment was inconclusive.

### 2016 laboratory release study - 6 donors

Kobayashi and colleagues found PRP released more growth factors early, while PRF
and A-PRF showed a more gradual release pattern over 10 days.

Read it correctly: This explains biologic rationale. It was not a facial-outcome
trial and cannot predict an individual's visible result.

### 2022 under-eye split-face trial - 40 participants

Diab and colleagues studied two sessions of PRP versus plasma gel. Both improved
periorbital wrinkles; the gel side performed better. Neither reduced measured
pigmentation.

Read it correctly: The plasma-gel protocol is not identical to every PRF EZ Gel
system, and improvement was not maintained through the following 3 months.

## Signaling proteins studied in PRF

PDGF | TGF-beta | VEGF | EGF | IGF

These factors are studied for roles in cell migration, collagen-related signaling,
microvascular activity and tissue-repair processes. Their presence supports the
biologic rationale; it does not guarantee a cosmetic outcome.

## Full references

1. Davies C, Miron RJ. Autologous platelet concentrates in esthetic medicine.
   *Periodontology 2000*. 2024. doi:10.1111/prd.12582.
2. Hu S, Bassiri-Tehrani M, Abraham MT. The Effect of Platelet-Rich Fibrin Matrix
   on Skin Rejuvenation: A Split-Face Comparison. *Aesthetic Surgery Journal*.
   2021;41(7):747-758. doi:10.1093/asj/sjaa244.
3. Kobayashi E, Fluckiger L, Fujioka-Kobayashi M, et al. Comparative release of
   growth factors from PRP, PRF, and advanced-PRF. *Clinical Oral Investigations*.
   2016. doi:10.1007/s00784-016-1719-1.
4. Diab HM, Elhosseiny R, Bedair NI, Khorkhed AH. Efficacy and safety of plasma
   gel versus platelet-rich plasma in periorbital rejuvenation: a comparative
   split-face clinical and Antera 3D camera study. *Archives of Dermatological
   Research*. 2022;314:661-671. doi:10.1007/s00403-021-02270-7.
5. Wang X, et al. Fluid platelet-rich fibrin stimulates greater dermal fibroblast
   migration than PRP in vitro. *Journal of Cosmetic Dermatology*. 2019.
   PubMed PMID: 30990574. Mechanism evidence only; not quoted on the brochure.

## Required consultation and outcome language

Not every client is a candidate. Final treatment, placement, timing and
combinations are confirmed after assessment. Temporary redness, swelling,
tenderness or bruising may occur. Individual outcomes vary.

Injectable PRF and PRF EZ Gel are RN-performed under medical direction. Topical
PRF is surface-applied during a selected needling service and is not injected.
""",
        encoding="utf-8",
    )
    return copy_path


def write_canva_import_html(outside_path: Path, inside_path: Path) -> Path:
    html_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Canva-Import.html"
    html_path.write_text(
        f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>House of Rose PRF Evidence Guide</title>
<style>
  html, body {{ margin: 0; padding: 0; background: #ddd; }}
  [data-document-role="page"] {{
    width: 11in;
    height: 8.5in;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: white;
    page-break-after: always;
  }}
  img {{ display: block; width: 100%; height: 100%; object-fit: fill; }}
</style>
</head>
<body>
  <section data-document-role="page" data-label="Outside spread">
    <img src="{outside_path.name}" alt="PRF Evidence Guide outside spread">
  </section>
  <section data-document-role="page" data-label="Inside spread">
    <img src="{inside_path.name}" alt="PRF Evidence Guide inside spread">
  </section>
</body>
</html>
""",
        encoding="utf-8",
    )
    return html_path


def main() -> None:
    outside = make_outside()
    inside = make_inside()
    outside_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Outside.png"
    inside_path = OUT / "House-of-Rose-PRF-Evidence-Guide-Inside.png"
    outside.save(outside_path, dpi=(300, 300), optimize=True)
    inside.save(inside_path, dpi=(300, 300), optimize=True)
    pdf_path = save_pdf(outside, inside)
    copy_path = write_copy_deck()
    html_path = write_canva_import_html(outside_path, inside_path)

    manifest = {
        "title": "House of Rose PRF Facial Aesthetics Evidence Guide",
        "format": "US Letter landscape, two-sided tri-fold, 300 DPI",
        "files": {
            "pdf": str(pdf_path),
            "outside_png": str(outside_path),
            "inside_png": str(inside_path),
            "copy_and_sources": str(copy_path),
            "canva_import_html": str(html_path),
        },
        "source_assets": {
            "hero": str(HERO),
            "before_after": str(BEFORE_AFTER),
            "monogram": str(MONOGRAM),
            "treatment_room": str(ROOM),
        },
        "production_notes": [
            "Outside order: back panel, fold-in panel, front cover.",
            "Inside order: benefits, treatment paths, evidence.",
            "Exact copy and citations are preserved deterministically.",
            "The Canva import is a two-page layout with each spread as a high-resolution image.",
        ],
    }
    (OUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
