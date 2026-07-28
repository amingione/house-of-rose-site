import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const here = path.dirname(new URL(import.meta.url).pathname);
const source = path.join(here, 'client-portrait-base.png');
const output = path.join(here, 'house-of-rose-complimentary-consult-feed.png');
const preview = path.join(here, 'house-of-rose-complimentary-consult-feed.jpg');
const fontPath = path.resolve(here, '../../../packages/web/public/fonts/Cochin-Regular.woff');
const fontData = fs.readFileSync(fontPath).toString('base64');

const width = 1080;
const height = 1350;

const overlay = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face { font-family: 'Cochin'; src: url(data:font/woff;base64,${fontData}) format('woff'); }
      .display { font-family: 'Cochin', Georgia, serif; }
      .sans { font-family: Arial, Helvetica, sans-serif; }
    </style>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#F4ECDC" stop-opacity="0.98"/>
      <stop offset="0.55" stop-color="#F4ECDC" stop-opacity="0.91"/>
      <stop offset="0.77" stop-color="#F4ECDC" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#F4ECDC" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1350" fill="url(#veil)"/>
  <rect x="58" y="58" width="964" height="1234" rx="2" fill="none" stroke="#7A5C2A" stroke-width="2" opacity="0.72"/>

  <text x="108" y="132" class="sans" font-size="22" letter-spacing="6" fill="#3E2C20">HOUSE OF ROSE</text>
  <text x="108" y="165" class="sans" font-size="15" letter-spacing="7" fill="#7A5C2A">AESTHETICS</text>
  <line x1="108" y1="202" x2="196" y2="202" stroke="#C9A24B" stroke-width="4"/>

  <text x="103" y="410" class="display" font-size="94" fill="#14110F">See your skin.</text>
  <text x="103" y="505" class="display" font-size="94" fill="#14110F">Plan with clarity.</text>

  <text x="108" y="605" class="sans" font-size="20" font-weight="700" letter-spacing="2.5" fill="#3F4D3A">COMPLIMENTARY CONSULTATION</text>
  <text x="108" y="640" class="sans" font-size="20" font-weight="700" letter-spacing="2.5" fill="#3F4D3A">+ AI SKIN ANALYSIS</text>

  <text x="108" y="715" class="sans" font-size="21" letter-spacing="0.5" fill="#2D2822">A thoughtful first step before</text>
  <text x="108" y="747" class="sans" font-size="21" letter-spacing="0.5" fill="#2D2822">you choose a treatment.</text>

  <rect x="108" y="845" width="362" height="72" rx="36" fill="#3F4D3A"/>
  <text x="289" y="890" text-anchor="middle" class="sans" font-size="18" font-weight="700" letter-spacing="2.2" fill="#F8F4EC">REQUEST YOUR CONSULT</text>

  <text x="108" y="1127" class="sans" font-size="16" font-weight="700" letter-spacing="2.6" fill="#7A5C2A">WALK-INS WELCOME · APPOINTMENTS RECOMMENDED</text>
  <text x="108" y="1180" class="sans" font-size="20" letter-spacing="1.4" fill="#14110F">PUNTA GORDA, FL</text>
  <text x="108" y="1220" class="sans" font-size="18" letter-spacing="0.7" fill="#5E5548">houseofrosefl.com  ·  (844) 941-7673</text>
</svg>`;

await sharp(source)
  .resize(width, height, { fit: 'cover', position: 'center' })
  .modulate({ saturation: 0.92, brightness: 1.01 })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(output);

await sharp(output)
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
  .toFile(preview);

console.log(output);
console.log(preview);
