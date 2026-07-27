from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from reportlab.graphics.barcode import qr
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "output" / "pdf" / "prf-brochure"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 3300, 2550
PANEL = 1100
MARGIN = 92

IVORY = "#F7F1E8"
CREAM = "#EFE4D5"
ESPRESSO = "#241A16"
INK = "#2D241F"
TAUPE = "#6F6258"
GOLD = "#B58A45"
CHAMPAGNE = "#D9BC7B"
BLUSH = "#D7B8A7"
SAGE = "#7A7B64"
WHITE = "#FFFDFC"

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


def fit_crop(image: Image.Image, size: tuple[int, int], focus_x: float = 0.5, focus_y: float = 0.5) -> Image.Image:
    image = image.convert("RGB")
    tw, th = size
    scale = max(tw / image.width, th / image.height)
    nw, nh = int(image.width * scale), int(image.height * scale)
    image = image.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(nw - tw, int((nw - tw) * focus_x)))
    top = max(0, min(nh - th, int((nh - th) * focus_y)))
    return image.crop((left, top, left + tw, top + th))


def rounded_paste(base: Image.Image, image: Image.Image, box: tuple[int, int, int, int], radius: int = 28) -> None:
    x0, y0, x1, y1 = box
    fitted = fit_crop(image, (x1 - x0, y1 - y0))
    mask = Image.new("L", fitted.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, fitted.width, fitted.height), radius=radius, fill=255)
    base.paste(fitted, (x0, y0), mask)


def wrap_lines(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, width: int) -> list[str]:
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
    spacing: int = 12,
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
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += int(draw.textlength(ch, font=fnt)) + tracking


def label(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fill: str = GOLD) -> int:
    tracking_text(draw, (x, y), text.upper(), font(SANS_BOLD, 30), fill, 4)
    return y + 52


def rule(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, fill: str = GOLD, weight: int = 3) -> None:
    draw.line((x, y, x + width, y), fill=fill, width=weight)


def bullet_list(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    items: list[str],
    width: int,
    fnt: ImageFont.FreeTypeFont,
    fill: str = INK,
    gap: int = 18,
) -> int:
    for item in items:
        draw.ellipse((x, y + 18, x + 12, y + 30), fill=GOLD)
        y = text_block(draw, (x + 32, y), item, fnt, fill, width - 32, spacing=9)
        y += gap
    return y


def qr_image(value: str, pixels: int = 360) -> Image.Image:
    widget = qr.QrCodeWidget(value)
    widget.qr.make()
    modules = widget.qr.modules
    count = widget.qr.moduleCount
    quiet = 4
    total = count + quiet * 2
    unit = max(1, pixels // total)
    actual = total * unit
    img = Image.new("RGB", (actual, actual), WHITE)
    d = ImageDraw.Draw(img)
    for row, values in enumerate(modules):
        for col, dark in enumerate(values):
            if dark:
                x0 = (col + quiet) * unit
                y0 = (row + quiet) * unit
                d.rectangle((x0, y0, x0 + unit - 1, y0 + unit - 1), fill=ESPRESSO)
    return img.resize((pixels, pixels), Image.Resampling.NEAREST)


def add_fold_marks(draw: ImageDraw.ImageDraw) -> None:
    for x in (PANEL, PANEL * 2):
        draw.line((x, 0, x, 34), fill="#A99272", width=3)
        draw.line((x, H - 34, x, H), fill="#A99272", width=3)


def make_outside() -> Image.Image:
    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)

    # Back panel
    d.rectangle((0, 0, PANEL, H), fill=ESPRESSO)
    room = fit_crop(Image.open(ROOM), (PANEL, 720), 0.42, 0.42)
    room = ImageEnhance.Color(room).enhance(0.55)
    room = ImageEnhance.Brightness(room).enhance(0.58)
    img.paste(room, (0, 0))
    overlay = Image.new("RGBA", (PANEL, 720), (36, 26, 22, 115))
    img.paste(overlay, (0, 0), overlay)
    mono = Image.open(MONOGRAM).convert("RGBA")
    mono.thumbnail((290, 290), Image.Resampling.LANCZOS)
    img.paste(mono, (MARGIN, 88), mono)
    d = ImageDraw.Draw(img)
    d.text((MARGIN, 395), "HOUSE OF ROSE", font=font(SERIF_BOLD, 65), fill=WHITE)
    tracking_text(d, (MARGIN + 4, 477), "A E S T H E T I C S", font(SANS, 25), CHAMPAGNE, 4)

    y = 795
    y = label(d, MARGIN, y, "Ready when you are", CHAMPAGNE)
    y = text_block(
        d,
        (MARGIN, y),
        "Your most personal facial starts with one conversation.",
        font(SERIF_BOLD, 67),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=12,
    )
    y += 28
    y = text_block(
        d,
        (MARGIN, y),
        "Tell us what you want to look different. We will help you choose the PRF path that makes sense for your face, your timeline and your comfort level.",
        font(SANS, 37),
        "#E9DED3",
        PANEL - 2 * MARGIN,
        spacing=12,
    )
    y += 45

    qr_img = qr_image("https://houseofrosefl.com/services/prf/", 330)
    qr_box = Image.new("RGB", (390, 390), WHITE)
    qr_box.paste(qr_img, (30, 30))
    img.paste(qr_box, (MARGIN, y))
    d = ImageDraw.Draw(img)
    tx = MARGIN + 435
    d.text((tx, y + 8), "CALL OR TEXT", font=font(SANS_BOLD, 29), fill=CHAMPAGNE)
    d.text((tx, y + 58), "(844) 941-ROSE", font=font(SANS_BOLD, 40), fill=WHITE)
    d.text((tx, y + 126), "houseofrosefl.com/\nservices/prf/", font=font(SANS, 31), fill="#E9DED3", spacing=11)
    d.text((tx, y + 232), "Scan to explore PRF", font=font(SANS_ITALIC, 27), fill="#CDBEB2")

    info_y = 2180
    rule(d, MARGIN, info_y, PANEL - 2 * MARGIN, CHAMPAGNE, 2)
    d.text((MARGIN, info_y + 28), "525 E Olympia Ave, Unit 9  |  Punta Gorda, FL 33950", font=font(SANS, 25), fill="#E9DED3")
    d.text((MARGIN, info_y + 78), "Advanced aesthetics & wellness  |  Walk-ins welcome; appointments recommended", font=font(SANS, 22), fill="#CDBEB2")
    d.text((MARGIN, info_y + 136), "MEDICAL DIRECTOR: JOSHUA SHAW, MD  |  FL LIC. ME136232", font=font(SANS_BOLD, 27), fill=CHAMPAGNE)

    # Fold-in panel
    x0 = PANEL
    d.rectangle((x0, 0, x0 + PANEL, H), fill=CREAM)
    y = 105
    y = label(d, x0 + MARGIN, y, "Why clients say yes")
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "A refresh that\nstill looks like you.",
        font(SERIF_BOLD, 73),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=12,
    )
    y += 26
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "PRF begins with a small sample of your own blood. The platelet- and fibrin-rich portion is prepared the same day and used in a personalized facial-aesthetics plan.",
        font(SANS, 36),
        INK,
        PANEL - 2 * MARGIN,
        spacing=12,
    )
    y += 34
    d.rounded_rectangle(
        (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 320),
        radius=32,
        fill="#E1D2BF",
        outline="#D2B98F",
        width=2,
    )
    by = y + 38
    by = bullet_list(
        d,
        x0 + MARGIN + 34,
        by,
        [
            "Client-derived - created from you",
            "Designed for subtle, natural-looking change",
            "No synthetic filler material in PRF or EZ Gel",
            "A plan tailored to your features and goals",
        ],
        PANEL - 2 * MARGIN - 68,
        font(SANS_BOLD, 31),
        gap=8,
    )
    y += 365

    ba = Image.open(BEFORE_AFTER)
    rounded_paste(img, ba, (x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 665), 30)
    d = ImageDraw.Draw(img)
    y += 685
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "PRF EZ Gel under-eyes",
        font(SERIF_BOLD, 43),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=8,
        align="center",
    )
    y += 2
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "One client's individual result. Treatment plan, timing and response vary.",
        font(SANS_ITALIC, 25),
        TAUPE,
        PANEL - 2 * MARGIN,
        spacing=7,
        align="center",
    )
    d.text((x0 + MARGIN, 2410), "Real skin. Thoughtful expectations. Beautifully personal.", font=font(SERIF_ITALIC, 28), fill=GOLD)

    # Front cover
    x0 = PANEL * 2
    hero = fit_crop(Image.open(HERO), (PANEL, H), 0.73, 0.46)
    hero = ImageEnhance.Color(hero).enhance(0.86)
    img.paste(hero, (x0, 0))
    cover_overlay = Image.new("RGBA", (PANEL, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(cover_overlay)
    for yy in range(H):
        alpha = int(30 + 155 * max(0, (yy / H - 0.42) / 0.58))
        od.line((0, yy, PANEL, yy), fill=(35, 24, 19, alpha))
    img.paste(cover_overlay, (x0, 0), cover_overlay)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((x0 + 74, 76, x0 + PANEL - 74, 335), radius=28, fill=(247, 241, 232, 222))
    mono = Image.open(MONOGRAM).convert("RGBA")
    mono.thumbnail((190, 190), Image.Resampling.LANCZOS)
    img.paste(mono, (x0 + 120, 108), mono)
    d = ImageDraw.Draw(img)
    d.text((x0 + 340, 120), "HOUSE OF ROSE", font=font(SERIF_BOLD, 53), fill=ESPRESSO)
    tracking_text(d, (x0 + 345, 195), "A E S T H E T I C S", font(SANS, 24), GOLD, 3)

    text_y = 1515
    d.text((x0 + MARGIN, text_y), "PLATELET-RICH FIBRIN", font=font(SANS_BOLD, 29), fill=CHAMPAGNE)
    text_y += 72
    text_y = text_block(
        d,
        (x0 + MARGIN, text_y),
        "Your most personal\nskin investment.",
        font(SERIF_BOLD, 76),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=10,
    )
    text_y += 26
    text_y = text_block(
        d,
        (x0 + MARGIN, text_y),
        "A natural-looking refresh, created from you.",
        font(SANS_BOLD, 38),
        WHITE,
        PANEL - 2 * MARGIN,
        spacing=10,
    )
    text_y += 40
    rule(d, x0 + MARGIN, text_y, 245, CHAMPAGNE, 4)
    text_y += 40
    tracking_text(d, (x0 + MARGIN, text_y), "INJECTABLE PRF  •  EZ GEL  •  TOPICAL PRF", font(SANS_BOLD, 24), WHITE, 1)
    d.text((x0 + MARGIN, 2396), "MODEL SHOWN  |  INDIVIDUAL OUTCOMES VARY", font=font(SANS, 19), fill="#E7D9CF")

    add_fold_marks(d)
    return img


def make_inside() -> Image.Image:
    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)

    # Full-width editorial header
    d.rectangle((0, 0, W, 400), fill=ESPRESSO)
    d.text((105, 72), "PRF, designed around the face you already love.", font=font(SERIF_BOLD, 77), fill=WHITE)
    d.text((108, 188), "TARGETED RENEWAL  •  SUBTLE VOLUME  •  LUMINOUS SKIN QUALITY", font=font(SANS_BOLD, 30), fill=CHAMPAGNE)
    d.text((108, 262), "The wow is not looking different. It is looking rested, refined and unmistakably like yourself.", font=font(SERIF_ITALIC, 36), fill="#EADFD6")

    # Left panel: desire + benefits
    x0 = 0
    y = 490
    y = label(d, x0 + MARGIN, y, "The visible payoff")
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "Look more rested.\nFeel more confident.\nStill look like you.",
        font(SERIF_BOLD, 65),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=10,
    )
    y += 30
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "PRF is for the client who wants visible refinement without an overfilled or overdone look.",
        font(SANS_BOLD, 35),
        INK,
        PANEL - 2 * MARGIN,
        spacing=11,
    )
    y += 35
    y = bullet_list(
        d,
        x0 + MARGIN,
        y,
        [
            "A brighter, more refreshed under-eye appearance",
            "Softer-looking fine lines and crepey texture",
            "Smoother-looking texture and more even-looking tone",
            "Fresh radiance and improved overall skin quality",
            "Subtle, temporary volume with EZ Gel where appropriate",
        ],
        PANEL - 2 * MARGIN,
        font(SANS, 35),
        gap=16,
    )
    y += 28
    d.rounded_rectangle((MARGIN, y, PANEL - MARGIN, y + 230), radius=30, fill="#E8DCCB")
    d.text((MARGIN + 35, y + 30), "WHY IT FEELS DIFFERENT", font=font(SANS_BOLD, 27), fill=GOLD)
    text_block(
        d,
        (MARGIN + 35, y + 85),
        "PRF does not ask your face to become someone else's. It supports a gradual, personalized approach built around your own features.",
        font(SERIF_ITALIC, 32),
        ESPRESSO,
        PANEL - 2 * MARGIN - 70,
        spacing=9,
    )

    # Middle panel: treatment paths
    x0 = PANEL
    d.rectangle((x0, 400, x0 + PANEL, H), fill=CREAM)
    y = 490
    y = label(d, x0 + MARGIN, y, "Choose your path")
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "Three ways to make PRF personal.",
        font(SERIF_BOLD, 60),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=10,
    )
    y += 36

    paths = [
        (
            "01",
            "INJECTABLE PRF",
            "Placed in select facial areas by a registered nurse for targeted under-eye concerns, fine-line appearance and overall skin quality.",
            "BEST FOR: a tired, shadowed or crepey under-eye look; targeted facial refinement.",
        ),
        (
            "02",
            "PRF EZ GEL",
            "Your PRF is gently processed into a soft, client-derived gel designed to add subtle, temporary volume while supporting natural-looking rejuvenation.",
            "BEST FOR: delicate areas where a softer, more gradual alternative to synthetic filler is preferred.",
        ),
        (
            "03",
            "TOPICAL PRF + NEEDLING",
            "PRF is applied to the skin surface during a selected microneedling or microchanneling service to complement the skin-renewal experience.",
            "BEST FOR: the appearance of texture, tone, fine lines and radiance across the treated surface.",
        ),
    ]
    for number, title, body, best in paths:
        d.rounded_rectangle((x0 + MARGIN, y, x0 + PANEL - MARGIN, y + 475), radius=30, fill="#FAF6F0", outline="#DDC7A5", width=2)
        d.text((x0 + MARGIN + 32, y + 30), number, font=font(SERIF_BOLD, 58), fill=GOLD)
        d.text((x0 + MARGIN + 132, y + 40), title, font=font(SANS_BOLD, 32), fill=ESPRESSO)
        ty = text_block(
            d,
            (x0 + MARGIN + 32, y + 118),
            body,
            font(SANS, 32),
            INK,
            PANEL - 2 * MARGIN - 64,
            spacing=9,
        )
        text_block(
            d,
            (x0 + MARGIN + 32, ty + 20),
            best,
            font(SANS_BOLD, 25),
            GOLD,
            PANEL - 2 * MARGIN - 64,
            spacing=7,
        )
        y += 505

    # Right panel: process, expectations, CTA
    x0 = PANEL * 2
    y = 490
    y = label(d, x0 + MARGIN, y, "Your experience")
    y = text_block(
        d,
        (x0 + MARGIN, y),
        "One small blood draw.\nOne highly personal plan.",
        font(SERIF_BOLD, 59),
        ESPRESSO,
        PANEL - 2 * MARGIN,
        spacing=10,
    )
    y += 36

    steps = [
        ("1", "CONSULT", "We assess your goals, anatomy, health history and candidacy."),
        ("2", "PREPARE", "A small sample of your blood is drawn and centrifuged the same day."),
        ("3", "PERSONALIZE", "Your provider selects liquid PRF, EZ Gel or topical application."),
        ("4", "REVEAL", "Changes develop progressively, with timing and maintenance tailored to you."),
    ]
    for n, title, body in steps:
        d.ellipse((x0 + MARGIN, y + 4, x0 + MARGIN + 64, y + 68), fill=ESPRESSO)
        d.text((x0 + MARGIN + 22, y + 14), n, font=font(SANS_BOLD, 30), fill=CHAMPAGNE)
        d.text((x0 + MARGIN + 88, y), title, font=font(SANS_BOLD, 30), fill=GOLD)
        y = text_block(
            d,
            (x0 + MARGIN + 88, y + 45),
            body,
            font(SANS, 31),
            INK,
            PANEL - 2 * MARGIN - 88,
            spacing=8,
        )
        y += 24

    d.rounded_rectangle((x0 + MARGIN, 1710, x0 + PANEL - MARGIN, 2220), radius=34, fill=ESPRESSO)
    d.text((x0 + MARGIN + 40, 1752), "YOUR NEXT STEP", font=font(SANS_BOLD, 28), fill=CHAMPAGNE)
    text_block(
        d,
        (x0 + MARGIN + 40, 1815),
        "Let us show you what your own biology can do.",
        font(SERIF_BOLD, 48),
        WHITE,
        PANEL - 2 * MARGIN - 80,
        spacing=9,
    )
    d.text((x0 + MARGIN + 40, 1990), "CALL OR TEXT  (844) 941-ROSE", font=font(SANS_BOLD, 33), fill=WHITE)
    d.text((x0 + MARGIN + 40, 2050), "houseofrosefl.com/services/prf/", font=font(SANS, 27), fill="#E7D9CF")
    d.text((x0 + MARGIN + 40, 2110), "Walk-ins welcome; appointments recommended.", font=font(SANS_ITALIC, 24), fill="#CDBEB2")

    footer = (
        "Not every client is a candidate. Injectable PRF and EZ Gel are RN-performed under medical direction; "
        "topical PRF is surface-applied during a selected facial service. Final treatment, placement, timing "
        "and combinations are confirmed after assessment. Temporary redness, swelling, tenderness or bruising "
        "may occur. Individual outcomes vary."
    )
    text_block(
        d,
        (x0 + MARGIN, 2280),
        footer,
        font(SANS, 21),
        TAUPE,
        PANEL - 2 * MARGIN,
        spacing=6,
    )

    add_fold_marks(d)
    return img


def save_pdf(outside: Image.Image, inside: Image.Image) -> None:
    pdf_path = OUT / "House-of-Rose-PRF-Tri-Fold-Brochure.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=landscape(letter))
    page_w, page_h = landscape(letter)
    for page in (OUT / "House-of-Rose-PRF-Brochure-Outside.png", OUT / "House-of-Rose-PRF-Brochure-Inside.png"):
        c.drawImage(str(page), 0, 0, width=page_w, height=page_h, preserveAspectRatio=False, mask="auto")
        c.showPage()
    c.setTitle("House of Rose PRF Tri-Fold Brochure")
    c.setAuthor("House of Rose Aesthetics")
    c.setSubject("Platelet-Rich Fibrin facial aesthetics brochure")
    c.save()


def main() -> None:
    outside = make_outside()
    inside = make_inside()
    outside_path = OUT / "House-of-Rose-PRF-Brochure-Outside.png"
    inside_path = OUT / "House-of-Rose-PRF-Brochure-Inside.png"
    outside.save(outside_path, dpi=(300, 300), optimize=True)
    inside.save(inside_path, dpi=(300, 300), optimize=True)
    save_pdf(outside, inside)

    copy_deck = """# House of Rose PRF Tri-Fold Brochure - Final Copy Deck

## Front cover

**Platelet-Rich Fibrin**

**Your most personal skin investment.**

A natural-looking refresh, created from you.

Injectable PRF - EZ Gel - Topical PRF

## Fold-in panel

**Why clients say yes**

**A refresh that still looks like you.**

PRF begins with a small sample of your own blood. The platelet- and fibrin-rich portion is prepared the same day and used in a personalized facial-aesthetics plan.

- Client-derived - created from you
- Designed for subtle, natural-looking change
- No synthetic filler material in PRF or EZ Gel
- A plan tailored to your features and goals

**PRF EZ Gel under-eyes**

One client's individual result. Treatment plan, timing and response vary.

## Back panel

**Ready when you are**

**Your most personal facial starts with one conversation.**

Tell us what you want to look different. We will help you choose the PRF path that makes sense for your face, your timeline and your comfort level.

Call or text (844) 941-ROSE

https://houseofrosefl.com/services/prf/

525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950

Advanced aesthetics & wellness - Walk-ins welcome; appointments recommended.

Medical Director: Joshua Shaw, MD - FL Lic. ME136232

## Inside spread

**PRF, designed around the face you already love.**

Targeted renewal - subtle volume - luminous skin quality

The wow is not looking different. It is looking rested, refined and unmistakably like yourself.

### The visible payoff

**Look more rested. Feel more confident. Still look like you.**

PRF is for the client who wants visible refinement without an overfilled or overdone look.

- A brighter, more refreshed under-eye appearance
- Softer-looking fine lines and crepey texture
- Smoother-looking texture and more even-looking tone
- Fresh radiance and improved overall skin quality
- Subtle, temporary volume with EZ Gel where appropriate

### Three ways to make PRF personal

**Injectable PRF:** Placed in select facial areas by a registered nurse for targeted under-eye concerns, fine-line appearance and overall skin quality.

**PRF EZ Gel:** Your PRF is gently processed into a soft, client-derived gel designed to add subtle, temporary volume while supporting natural-looking rejuvenation.

**Topical PRF + Needling:** PRF is applied to the skin surface during a selected microneedling or microchanneling service to complement the skin-renewal experience.

### Your experience

1. Consult
2. Prepare
3. Personalize
4. Reveal

**Let us show you what your own biology can do.**

Call or text (844) 941-ROSE

https://houseofrosefl.com/services/prf/

Walk-ins welcome; appointments recommended.

**Candidacy and outcomes note:** Not every client is a candidate. Injectable PRF and EZ Gel are RN-performed under medical direction; topical PRF is surface-applied during a selected facial service. Final treatment, placement, timing and combinations are confirmed after assessment. Temporary redness, swelling, tenderness or bruising may occur. Individual outcomes vary.
"""
    (OUT / "House-of-Rose-PRF-Brochure-Copy-Deck.md").write_text(copy_deck, encoding="utf-8")

    manifest = {
        "title": "House of Rose PRF Tri-Fold Brochure",
        "format": "US Letter landscape, two-sided tri-fold",
        "dimensions": {"pixels": [W, H], "dpi": 300, "inches": [11, 8.5]},
        "files": [
            "House-of-Rose-PRF-Tri-Fold-Brochure.pdf",
            "House-of-Rose-PRF-Brochure-Outside.png",
            "House-of-Rose-PRF-Brochure-Inside.png",
            "House-of-Rose-PRF-Brochure-Copy-Deck.md",
            "source/generate_prf_brochure.py",
        ],
        "sources": {
            "existing_brochure": "/Users/ambermingione/Downloads/House of Rose - PRF Tri-Fold Brochure.zip",
            "hero_image": str(HERO),
            "before_after": str(BEFORE_AFTER),
            "logo": str(MONOGRAM),
            "research": [
                "docs/research/PRF/prf-injections-ezgel.md",
                "docs/research/PRF/prf-topical.md",
                "docs/research/_prf-source-library.md",
            ],
            "compliance": [
                "docs/staff/COMPLIANCE-COPY-RULES.md",
                "docs/compliance/FL-ADVERTISING-LAW.md",
            ],
        },
        "notes": [
            "Generated model image is labeled MODEL SHOWN.",
            "Before/after asset is labeled as one client's individual result.",
            "No pricing, discount, free offer or credited consultation is advertised.",
            "Medical director attribution uses the canonical verified line.",
        ],
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
