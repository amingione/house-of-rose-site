#!/usr/bin/env python3
"""Generate the two public House of Rose treatment-care PDFs."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "packages/web/public/downloads/treatment-care"

INK = colors.HexColor("#211F1D")
ROSE = colors.HexColor("#9B6A63")
WARM = colors.HexColor("#F4EFE8")
MUTED = colors.HexColor("#5E5853")

TREATMENT_INDEX = [
    ("Injectables & Bio-Fillers", "Injectables and blood-derived services"),
    ("Neurotoxin Injections (Botox and Daxxify)", "Injectables and blood-derived services"),
    ("Dermal Fillers", "Injectables and blood-derived services"),
    ("PRF Under Eyes and PRF Injections", "Injectables and blood-derived services"),
    ("IV Hydration Therapy", "IV hydration"),
    ("GLP-1 Weight Management", "GLP-1 weight management"),
    ("Morpheus8 RF Microneedling and Morpheus8 Body", "Microneedling and RF microneedling"),
    ("Microneedling, Procell, and topical PRF", "Microneedling and RF microneedling"),
    ("Lumecca Peak IPL", "IPL and light-based treatment"),
    ("Forma RF Facial", "Forma surface radiofrequency"),
    ("BioRePeel", "Chemical peels"),
    ("Face Reality Acne Program and Acne Bootcamp", "Face Reality program"),
    ("Glo2Facial", "Glo2Facial and gentle facials"),
    ("Dermaplaning", "Dermaplaning"),
    ("Facial and Body Waxing", "Waxing"),
    ("Bridal, Event, and Everyday Makeup", "Professional makeup"),
]

PRECARE = {
    "Start here for every service": [
        "Read the section for your treatment before the day of your visit.",
        "Tell House of Rose about pregnancy or breastfeeding, allergies, recent procedures, active infection, cold sores, changes in health, and all medicines or supplements that may affect treatment.",
        "Do not stop a prescribed medicine unless the clinician who prescribed it tells you to stop.",
        "Arrive with the treatment area clean when practical. Bring questions and the names of products or medicines you are unsure about.",
        "If your provider gives you instructions that differ from this general guide, follow the personalized instructions.",
    ],
    "Injectables and blood-derived services": [
        "Plan treatment well before an important photographed event because swelling or bruising can occur, especially with dermal filler and injectable PRF.",
        "Report prior reactions, bleeding or clotting concerns, blood-thinning medicines or supplements, immune conditions, active infection, dental work, and any history relevant to the area being treated.",
        "Arrive without makeup on the injection area when practical and eat normally unless your licensed provider gives different instructions.",
        "PRF services include a small blood draw. Tell the practice if blood draws have caused fainting or difficulty in the past.",
    ],
    "IV hydration": [
        "Eat and hydrate normally before the visit unless Diana Morrison, RN gives different instructions.",
        "Bring an accurate medication, allergy, and health-history list. The current formula and candidacy must be reviewed before an IV is started.",
        "Wear clothing that gives comfortable access to the arm.",
    ],
    "GLP-1 weight management": [
        "Bring a complete medication and supplement list plus relevant medical history to the consultation.",
        "Write down prior weight-management medications, side effects, and the questions you want reviewed.",
        "Do not begin, stop, share, or change the dose of a prescription medication on your own.",
    ],
    "Microneedling and RF microneedling": [
        "Avoid arriving with sunburn, an active rash, open skin, or infection in the treatment area; contact House of Rose if the skin changes before the visit.",
        "Report a history of cold sores, poor wound healing, immune conditions, recent procedures, and medicines or products that affect the skin.",
        "Do not use a new irritating skin product immediately before treatment. Follow the exact product hold instructions given for your plan.",
        "Arrange the visit with enough recovery time before an important event; redness, tightness, dryness, swelling, or flaking may occur depending on depth and area.",
    ],
    "IPL and light-based treatment": [
        "Avoid tanning and intentional sun exposure. Tell House of Rose about recent sun exposure or self-tanner before treatment.",
        "Provide a complete list of medicines and supplements, especially anything that may increase light sensitivity.",
        "Do not arrive with an active infection, open skin, or sunburn in the planned area.",
        "Follow the exact shaving, product-hold, and sun-exposure instructions given for your selected body area.",
    ],
    "Forma surface radiofrequency": [
        "Tell House of Rose about implants, devices, recent procedures, active skin problems, and changes in health before treatment.",
        "Arrive with the selected area clean and without heavy skin products when practical.",
        "Report new irritation, sunburn, or infection before the visit.",
    ],
    "Chemical peels": [
        "Report cold sores, active irritation, open skin, recent hair removal, recent procedures, and medicines or products that change skin sensitivity.",
        "Do not add a strong new exfoliant, retinoid, or acne active immediately before the peel. Follow the exact hold schedule given for your skin and products.",
        "Avoid tanning and arrive without sunburn.",
    ],
    "Face Reality program": [
        "Bring every current skin-care product, medicine, and supplement to the first review or provide clear photos of the labels.",
        "Follow the assigned home-care routine as written; do not add new acne actives without checking first.",
        "Tell Amber Mingione, Licensed Esthetician about irritation, pregnancy or breastfeeding, medication changes, and changes in breakouts before the next treatment.",
    ],
    "Glo2Facial and gentle facials": [
        "Tell House of Rose about allergies, active irritation, sunburn, recent procedures, and any product that has recently caused a reaction.",
        "Arrive with clean skin when practical and avoid introducing a strong new active immediately before the facial.",
    ],
    "Dermaplaning": [
        "Tell House of Rose about active irritation, open skin, raised lesions, recent exfoliation, cold sores, and medicines or products that affect skin sensitivity.",
        "Avoid facial waxing or another aggressive exfoliation immediately before the service unless your provider has specifically coordinated the timing.",
        "Arrive without heavy makeup when practical.",
    ],
    "Waxing": [
        "Hair must be long enough for wax to grip. If you are unsure, ask before trimming or shaving.",
        "Report retinoids, isotretinoin, exfoliating acids, recent peels, sunburn, or other factors that can make skin fragile.",
        "Arrive with clean, dry skin and avoid applying oil or heavy lotion to the area.",
    ],
    "Professional makeup": [
        "Arrive with a clean face unless Aundrea Pedigo, Licensed Esthetician gives different instructions.",
        "Bring reference images that show the finish you like, plus photos of the clothing and event lighting when relevant.",
        "Report product allergies or sensitivities and bring any must-use personal lip product or specialty item.",
    ],
}

AFTERCARE = {
    "Start here for every service": [
        "Follow the personalized instructions given at your visit; they take priority over this general guide.",
        "Do not pick, scratch, scrub, or deliberately irritate a treated area.",
        "Use only the products your provider says are appropriate during the early recovery window.",
        "Contact House of Rose with a question about an unexpected response. Seek urgent medical care for trouble breathing, chest pain, fainting, signs of a severe allergic reaction, sudden vision change, or another emergency.",
    ],
    "Injectables and blood-derived services": [
        "Do not press or massage an injected area unless Diana Morrison, RN specifically instructs you to do so.",
        "Follow the product- and area-specific limits on exercise, heat, alcohol, positioning, makeup, and skin treatments that you receive at the visit.",
        "Temporary tenderness, redness, swelling, or bruising can occur. Dermal filler should be planned well before a photographed event because swelling and bruising may take time to settle.",
        "Contact the practice promptly about severe or increasing pain, unusual color change, marked asymmetry, vision symptoms, or any response you were told to report.",
    ],
    "IV hydration": [
        "Keep the small dressing on the IV site for the time recommended at your visit.",
        "Mild site tenderness or a small bruise can occur. Contact the practice about increasing redness, warmth, swelling, drainage, persistent bleeding, or worsening pain.",
        "Follow any formulation-specific instructions given by Diana Morrison, RN.",
    ],
    "GLP-1 weight management": [
        "Use the medication exactly as prescribed and do not change the dose or schedule on your own.",
        "Follow the storage, injection, missed-dose, nutrition, hydration, and side-effect instructions provided with your medication plan.",
        "Contact the practice about side effects or questions; seek urgent medical care for severe symptoms or an emergency.",
    ],
    "Microneedling and RF microneedling": [
        "Treat the skin as temporarily vulnerable. Keep hands, tools, and unapproved products away from the treated area.",
        "Follow the written schedule for cleansing, moisturizer, sunscreen, makeup, exercise, heat, swimming, and active skin-care products.",
        "Redness, tightness, dryness, swelling, or mild flaking can occur. Do not pick at flaking skin.",
        "Contact House of Rose about increasing pain, spreading redness, drainage, blistering, or another response outside the expected instructions.",
    ],
    "IPL and light-based treatment": [
        "Protect the treated area from sun and follow the sunscreen and heat-exposure instructions provided at the visit.",
        "Do not pick or scrub darkened pigment or temporary surface crusting; allow it to shed naturally.",
        "Use gentle products until the skin has returned to its usual condition and you are cleared to restart active products.",
        "Report blistering, severe swelling, increasing pain, or an unexpected skin-color change promptly.",
    ],
    "Forma surface radiofrequency": [
        "Use gentle skin care and follow any same-day heat, exercise, or active-product instructions given for the treated area.",
        "Temporary warmth or redness may occur. Contact House of Rose if discomfort or redness increases instead of settling.",
    ],
    "Chemical peels": [
        "Use gentle cleanser, moisturizer, and sun protection as directed. Wait to restart retinoids, acids, scrubs, or other active products until cleared.",
        "Do not peel, pull, scrub, or pick at flaking skin.",
        "Avoid intentional sun and follow the instructions for exercise, heat, swimming, and makeup.",
        "Contact House of Rose about blistering, marked swelling, increasing pain, drainage, or an unexpected reaction.",
    ],
    "Face Reality program": [
        "Use the assigned home-care products in the order and frequency provided. More product is not better.",
        "Do not add or replace acne actives without checking with Amber Mingione, Licensed Esthetician.",
        "Record irritation, dryness, new medications, and changes in breakouts so the routine can be adjusted at the next review.",
    ],
    "Glo2Facial and gentle facials": [
        "Keep the routine simple for the rest of the day and follow any instructions about active products or sun exposure.",
        "Glo2Facial does not require a recovery period, but product-specific instructions still matter.",
        "Contact House of Rose if irritation increases or a reaction develops.",
    ],
    "Dermaplaning": [
        "Use gentle skin care and sun protection. Wait to restart strong exfoliants or retinoids until the timing given at your visit.",
        "Avoid scrubbing, picking, or adding another aggressive exfoliation while the skin is settling.",
        "Contact House of Rose about persistent or increasing irritation.",
    ],
    "Waxing": [
        "Keep the area clean and avoid friction, picking, heat, and heavily fragranced products during the initial post-wax period.",
        "Follow the area-specific instructions for exercise, swimming, sun, exfoliation, and sexual activity where relevant.",
        "Contact House of Rose about skin lifting, blistering, spreading redness, drainage, or worsening pain.",
    ],
    "Professional makeup": [
        "Remove makeup gently before sleeping unless your artist gives a different event-specific instruction.",
        "Use your usual gentle cleanser and avoid aggressive scrubbing around the eyes.",
        "Stop using a product and seek appropriate care if a significant eye or skin reaction develops.",
    ],
}


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("Title", parent=base["Title"], fontName="Times-Roman", fontSize=29, leading=34, textColor=INK, alignment=TA_CENTER, spaceAfter=16),
        "subtitle": ParagraphStyle("Subtitle", parent=base["BodyText"], fontName="Helvetica", fontSize=10, leading=15, textColor=MUTED, alignment=TA_CENTER, spaceAfter=24),
        "h1": ParagraphStyle("H1", parent=base["Heading1"], fontName="Times-Roman", fontSize=22, leading=27, textColor=INK, spaceBefore=9, spaceAfter=10),
        "h2": ParagraphStyle("H2", parent=base["Heading2"], fontName="Times-Roman", fontSize=15, leading=19, textColor=ROSE, spaceBefore=14, spaceAfter=7),
        "body": ParagraphStyle("Body", parent=base["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=MUTED, spaceAfter=7),
        "bullet": ParagraphStyle("Bullet", parent=base["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, leftIndent=14, firstLineIndent=-8, textColor=MUTED, spaceAfter=6),
        "small": ParagraphStyle("Small", parent=base["BodyText"], fontName="Helvetica", fontSize=7.5, leading=11, textColor=MUTED),
    }


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8C7BD"))
    canvas.line(0.72 * inch, 0.58 * inch, 7.78 * inch, 0.58 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(0.72 * inch, 0.38 * inch, "House of Rose Aesthetics | 525 E Olympia Ave, Unit 9 | Punta Gorda, FL 33950 | (941) 400-0165")
    canvas.drawRightString(7.78 * inch, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf(filename: str, title: str, sections: dict[str, list[str]]):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    path = OUTPUT / filename
    doc = SimpleDocTemplate(str(path), pagesize=letter, rightMargin=0.72 * inch, leftMargin=0.72 * inch, topMargin=0.7 * inch, bottomMargin=0.78 * inch, title=title, author="House of Rose Aesthetics")
    s = styles()
    story = [
        Spacer(1, 0.3 * inch),
        Paragraph("HOUSE OF ROSE AESTHETICS", s["subtitle"]),
        Paragraph(title, s["title"]),
        Paragraph("A treatment-indexed reference for current House of Rose services. Updated August 26, 2026.", s["subtitle"]),
        Paragraph("Important", s["h2"]),
        Paragraph("This guide provides general preparation and recovery information. It does not replace the instructions given for your exact treatment, medical advice, or emergency care. Your licensed provider's personalized directions take priority.", s["body"]),
        Spacer(1, 0.12 * inch),
        Paragraph("Find your treatment", s["h1"]),
    ]
    for treatment, section in TREATMENT_INDEX:
        story.append(Paragraph(f"<b>{treatment}</b> - {section}", s["body"]))
    story.append(PageBreak())

    for heading, bullets in sections.items():
        block = [Paragraph(heading, s["h1"])]
        for bullet in bullets:
            block.append(Paragraph(f"• {bullet}", s["bullet"]))
        story.append(KeepTogether(block))
        story.append(Spacer(1, 0.06 * inch))

    story.extend([
        PageBreak(),
        Paragraph("Sources and scope", s["h1"]),
        Paragraph("These guides provide general preparation and aftercare information for services offered at House of Rose. Instructions given to you for your specific treatment take priority.", s["body"]),
        Paragraph("Reviewed references include current House of Rose provider and treatment briefs; Procell Therapies aftercare and consent materials retained in the House of Rose repository; Face Reality professional home-care and peel guidance; Geneo treatment considerations and protocol resources; InMode clinical and manufacturer materials; and current product labeling for medically directed services where applicable.", s["body"]),
        Paragraph("Do not use this guide to decide candidacy, stop a prescribed medicine, select a medication or injectable product, or replace urgent medical care.", s["body"]),
        Spacer(1, 0.2 * inch),
        Paragraph("Questions: info@houseofrosefl.com | (941) 400-0165", s["body"]),
    ])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build_pdf("house-of-rose-pre-care-guide.pdf", "Treatment Pre-Care Guide", PRECARE)
    build_pdf("house-of-rose-aftercare-guide.pdf", "Treatment Aftercare Guide", AFTERCARE)
