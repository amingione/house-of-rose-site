#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
House of Rose Aesthetics — PRF Regenerative Pairing TRIFOLD (v3, editorial)
Every panel gets its own composition — no repeated template. Real trifold.
Original generated linework (no stock/site photos). Real brand tokens.
"""
from weasyprint import HTML

FONT_DIR = "assets/fonts"
LOGO = "assets/logo/hr-monogram-white.png"
ART = "assets/art"
OUT_DIR = "/sessions/lucid-blissful-mayer/mnt/house-of-rose-site/docs/GOVERNANCE/internal_only/marketing/print/prf-brochure"

def art_bg(name, opacity=1.0, blend=None):
    b = f"mix-blend-mode:{blend};" if blend else ""
    return f"""<img src="{ART}/{name}.png" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:{opacity}; z-index:0; {b}"/>"""

CSS = f"""
@font-face {{ font-family: 'Cochin'; src: url('{FONT_DIR}/Cochin-Regular.woff2'); font-weight: 400; }}
@font-face {{ font-family: 'Cochin'; src: url('{FONT_DIR}/Cochin-Bold.woff2'); font-weight: 700; }}

@page {{ size: 11in 8.5in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: #0B0B0A; font-family: Arial, 'Liberation Sans', Helvetica, sans-serif; }}

.sheet {{ width: 11in; height: 8.5in; display: flex; page-break-after: always; }}
.sheet:last-child {{ page-break-after: avoid; }}

.panel {{
  width: 3.6667in; height: 8.5in; position: relative; overflow: hidden;
  border-right: 1px dashed rgba(216,207,192,0.3);
}}
.panel:last-child {{ border-right: none; }}

.bg-charcoal {{ background: #0B0B0A; }}
.bg-walnut   {{ background: #241B17; }}
.bg-breath   {{ background: #12100F; }}
.bg-olive    {{ background: #5F624D; }}

.z1 {{ position: relative; z-index: 1; height: 100%; }}

.serif {{ font-family: 'Cochin', Georgia, 'Times New Roman', serif; color: #F1EDE5; font-weight: 400; }}
.kicker {{
  font-size: 9.5px; font-weight: bold; letter-spacing: 0.16em; text-transform: uppercase;
  color: #E7D6A8; display: block;
}}
p {{ font-size: 10.3px; line-height: 1.5; color: #D8CFC0; margin: 0 0 8px 0; }}
.small-print {{ font-size: 7.4px; color: rgba(216,207,192,0.68); line-height: 1.4; }}
.tagline {{ font-size: 7.6px; letter-spacing: 0.11em; text-transform: uppercase; color:#E7D6A8; }}
.hairline {{ border: none; border-top: 1px solid rgba(138,106,67,0.55); }}
.rule-thin {{ border: none; border-top: 1px solid rgba(241,237,229,0.16); }}

ul.bullets {{ list-style: none; margin: 0; padding: 0; }}
ul.bullets li {{ position: relative; padding-left: 13px; font-size: 10px; line-height: 1.45; color: #D8CFC0; margin-bottom: 7px; }}
ul.bullets li::before {{ content: ""; position: absolute; left: 0; top: 5px; width: 5px; height: 5px; background: #8A6A43; }}
ul.bullets.on-olive li::before {{ background: #F1EDE5; }}
ul.bullets.on-olive li {{ color: rgba(241,237,229,0.88); }}
ul.bullets li strong {{ color: #F1EDE5; }}

.cta-btn {{
  display: inline-block; background: #E7D6A8; color: #17110F; font-size: 10.5px; font-weight: bold;
  letter-spacing: 0.05em; text-transform: uppercase; padding: 10px 18px;
}}
.nap {{ font-size: 9.5px; color: #D8CFC0; line-height: 1.7; }}
.nap strong {{ color: #F1EDE5; font-size: 10.5px; }}

.ghost-num {{
  font-family: 'Cochin', Georgia, serif; font-size: 92px; line-height: 1; color: rgba(241,237,229,0.09);
  position: absolute; z-index: 0;
}}
"""

def build():
    # ============================== SIDE A (outside) ==============================
    # [Back Cover] [Inside Teaser] [Front Cover]

    panel_back = f"""
    <div class="panel bg-walnut">
      {art_bg('layered-arcs', 0.16)}
      <div class="ghost-num" style="bottom:-0.35in; left:-0.15in;">HR</div>
      <div class="z1" style="padding:0.5in 0.36in; display:flex; flex-direction:column; height:100%;">
        <img src="{LOGO}" style="width:0.42in; opacity:0.92; margin-bottom:0.45in;"/>
        <div style="flex:1;"></div>
        <span class="kicker" style="margin-bottom:8px;">Your Next Visit</span>
        <h2 class="serif" style="font-size:26px; line-height:1.1; margin:0 0 10px 0; max-width:2.3in;">Design your<br/>regenerative<br/>plan.</h2>
        <p style="max-width:2.2in;">Bring PRF to any visit. Tell us what you're already
        booking &mdash; we'll show you where it fits.</p>
        <div class="cta-btn" style="margin:6px 0 0.45in 0;">Call (844) 941-7673</div>
        <div class="nap">
          <strong>House of Rose Aesthetics</strong><br/>
          525 E Olympia Ave, Unit 9 &middot; Punta Gorda, FL 33950<br/>
          houseofrosefl.com
        </div>
        <hr class="hairline" style="margin:0.14in 0;"/>
        <div class="small-print">
          Individual results vary. Consultation required &mdash; your provider confirms
          which treatments and pairings are right for your skin.<br/>
          Medical Director: Joshua Shaw, MD &middot; FL Lic. ME136232
        </div>
        <div class="tagline" style="margin-top:6px;">Medical Aesthetics. Thoughtfully Practiced.</div>
      </div>
    </div>
    """

    panel_teaser = f"""
    <div class="panel bg-charcoal">
      {art_bg('science-mark', 0.45)}
      <div class="z1" style="padding:0.55in 0.36in 0.4in 0.36in; display:flex; flex-direction:column; height:100%;">
        <span class="kicker">01 &middot; The Science</span>
        <p class="serif" style="font-style:italic; font-size:23px; line-height:1.28; color:#F1EDE5; margin:0.16in 0 0.22in 0;">
          &ldquo;No two skins age, scar, or respond the same way.&rdquo;
        </p>
        <p style="font-size:10.6px; color:#F1EDE5; margin-bottom:0.2in;">That's the whole
        case for PRF &mdash; a treatment built to be layered in, not booked alone.</p>
        <hr class="rule-thin" style="margin:0 0 0.2in 0;"/>
        <span class="kicker" style="color:#D8CFC0; font-size:8.6px;">How It's Made</span>
        <ul class="bullets" style="margin-top:8px;">
          <li><strong>Drawn</strong> &mdash; a small blood sample, taken chairside</li>
          <li><strong>Spun</strong> &mdash; concentrates platelets, growth factors, fibrin</li>
          <li><strong>Applied</strong> &mdash; to the skin's surface during an eligible
          microneedling treatment. Not injected.</li>
          <li><strong>Same-day</strong> &mdash; added to your plan the day it's drawn</li>
        </ul>
        <div style="flex:1;"></div>
        <p class="small-print">Eligibility confirmed by your provider.</p>
      </div>
    </div>
    """

    panel_cover = f"""
    <div class="panel bg-breath">
      {art_bg('cover-rings', 0.85)}
      <img src="{LOGO}" style="position:absolute; top:-0.6in; right:-0.75in; width:3.1in; opacity:0.06; z-index:0;"/>
      <div class="z1" style="padding:0.55in 0.36in; display:flex; flex-direction:column; height:100%;">
        <span class="kicker">PRF &middot; Regenerative Therapy</span>
        <div style="flex:1;"></div>
        <h1 class="serif" style="font-size:44px; line-height:1.04; margin:0 0 0.16in 0;">One<br/>treatment.<br/>Endless<br/>pairings.</h1>
        <p style="font-size:11.5px; color:#F1EDE5; max-width:2.3in;">Your skin isn't like
        anyone else's. Neither is your plan.</p>
        <img src="{LOGO}" style="width:0.4in; opacity:0.85; margin-top:0.3in;"/>
        <div class="tagline" style="margin-top:0.1in;">Medical Aesthetics. Thoughtfully Practiced.</div>
      </div>
    </div>
    """

    # ============================== SIDE B (inside spread) ==============================
    # [Lumecca] [Morpheus8 — olive, the hero break] [Build Your Plan]

    panel_lumecca = f"""
    <div class="panel bg-charcoal">
      {art_bg('light-burst', 0.85)}
      <div class="z1" style="padding:0.55in 0.36in 0.5in 0.36in; display:flex; flex-direction:column; height:100%;">
        <span class="kicker">02 &middot; Pairing &middot; Tone &amp; Light</span>
        <h2 class="serif" style="font-size:26px; margin:0.14in 0 0.14in 0;">PRF + Lumecca IPL</h2>
        <p style="font-size:11.5px; color:#F1EDE5; font-style:italic; margin-bottom:0.2in;">
        Correct the tone. Feed the recovery.</p>
        <p>Lumecca is broad-spectrum IPL, aimed at uneven tone, visible sun damage, and
        redness-prone skin. Layer topical PRF into the same plan and your skin gets
        regenerative support exactly when it's already working hardest to renew itself.</p>
        <div style="flex:1;"></div>
        <hr class="rule-thin" style="margin-bottom:0.12in;"/>
        <p style="font-size:10.5px; color:#F1EDE5; font-style:italic; margin:0;">Two
        treatments, aimed at the same result, from two different directions.</p>
      </div>
    </div>
    """

    panel_morpheus = f"""
    <div class="panel bg-olive">
      {art_bg('channel-grid', 0.5)}
      <div class="z1" style="padding:0.55in 0.36in; display:flex; flex-direction:column; height:100%;">
        <span class="kicker" style="color:#17110F;">03 &middot; Pairing &middot; Texture &amp; Scarring</span>
        <h2 class="serif" style="font-size:28px; color:#F1EDE5; margin:0.14in 0 0.05in 0;">PRF +<br/>Morpheus8</h2>
        <p style="font-size:11.5px; color:#F1EDE5; font-style:italic; margin-bottom:0.22in;">
        Open the channel. Fill it with regeneration.</p>
        <ul class="bullets on-olive">
          <li>RF microneedling built for texture, acne scarring, and stretch marks</li>
          <li>Opens a controlled network of micro-channels across the treatment area</li>
          <li>PRF is layered on right behind it, same visit</li>
          <li>One regenerative plan, built around what your skin actually needs</li>
        </ul>
        <div style="flex:1;"></div>
        <p class="small-print" style="color:rgba(241,237,229,0.75);">Individual results vary.</p>
      </div>
    </div>
    """

    panel_ritual = f"""
    <div class="panel bg-charcoal">
      <div class="z1" style="padding:0.55in 0.36in 0.4in 0.36in; display:flex; flex-direction:column; height:100%;">
        <span class="kicker">04 &middot; Build Your Plan</span>
        <h2 class="serif" style="font-size:24px; margin:0.1in 0 0.26in 0;">PRF plays well<br/>with everything.</h2>

        <div style="position:relative; margin-bottom:0.16in;">
          <div class="ghost-num" style="position:relative; font-size:46px; top:-6px;">01</div>
          <div style="margin-top:-38px; padding-left:44px;">
            <span class="serif" style="font-size:13px; display:block;">Prep</span>
            <p style="margin:0;">Dermaplaning &mdash; a smoother surface to build on.</p>
          </div>
        </div>
        <div style="position:relative; margin-bottom:0.16in;">
          <div class="ghost-num" style="position:relative; font-size:46px; top:-6px;">02</div>
          <div style="margin-top:-38px; padding-left:44px;">
            <span class="serif" style="font-size:13px; display:block;">Resurface</span>
            <p style="margin:0;">Microneedling, Morpheus8, or Lumecca &mdash; matched to
            your skin.</p>
          </div>
        </div>
        <div style="position:relative; margin-bottom:0.16in;">
          <div class="ghost-num" style="position:relative; font-size:46px; top:-6px;">03</div>
          <div style="margin-top:-38px; padding-left:44px;">
            <span class="serif" style="font-size:13px; display:block;">Regenerate</span>
            <p style="margin:0;">Topical PRF, layered in the same visit.</p>
          </div>
        </div>
        <div style="position:relative; margin-bottom:0.2in;">
          <div class="ghost-num" style="position:relative; font-size:46px; top:-6px;">04</div>
          <div style="margin-top:-38px; padding-left:44px;">
            <span class="serif" style="font-size:13px; display:block;">Finish</span>
            <p style="margin:0;">Glo2Facial or BioRePeel, added for a deeper reset.</p>
          </div>
        </div>

        <div style="flex:1;"></div>
        <hr class="rule-thin" style="margin-bottom:0.14in;"/>
        <p style="font-size:11px; color:#F1EDE5; font-style:italic; margin:0;">Most clients
        build a plan of three or more. Tell us your skin &mdash; we'll build yours.</p>
      </div>
    </div>
    """

    side_a = f"<div class='sheet'>{panel_back}{panel_teaser}{panel_cover}</div>"
    side_b = f"<div class='sheet'>{panel_lumecca}{panel_morpheus}{panel_ritual}</div>"
    html = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{side_a}{side_b}</body></html>"
    HTML(string=html, base_url=OUT_DIR + "/").write_pdf(OUT_DIR + "/House-of-Rose-PRF-Trifold.pdf")
    with open(OUT_DIR + "/House-of-Rose-PRF-Trifold.html", "w") as f:
        f.write(html)
    print("Built trifold PDF + HTML at", OUT_DIR)

if __name__ == "__main__":
    build()
