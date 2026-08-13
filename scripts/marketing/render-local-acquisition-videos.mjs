#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

throw new Error(
  'VOICE RESET: Q3 acquisition video rendering is disabled until the source frames and public copy are approved.',
);

const outputFlag = process.argv.indexOf('--output');
if (outputFlag === -1 || !process.argv[outputFlag + 1]) {
  console.error('Usage: render-local-acquisition-videos.mjs --output /absolute/output/path');
  process.exit(2);
}

const outputRoot = path.resolve(process.argv[outputFlag + 1]);
const videoDir = path.join(outputRoot, 'video');
await mkdir(videoDir, { recursive: true });

const routes = [
  {
    id: '01-local-studio',
    title: 'Local Studio',
    frames: ['01-local-proof', '03-studio-experience', '02-consultation'],
    destination: '/skin-analysis/',
    campaign: 'hor_skin_consult_q3',
  },
  {
    id: '02-see-your-skin-first',
    title: 'See Your Skin First',
    frames: ['02-consultation', '06-provider-voice', '01-local-proof'],
    destination: '/skin-analysis/',
    campaign: 'hor_skin_consult_q3',
  },
  {
    id: '03-advanced-skin',
    title: 'Advanced Skin',
    frames: ['04-advanced-skin', '03-studio-experience', '02-consultation'],
    destination: '/services/microneedling/',
    campaign: 'hor_advanced_skin_q3',
  },
];

const formats = [
  { name: 'vertical', suffix: 'story-1080x1920.png', width: 1080, height: 1920 },
  { name: 'feed', suffix: 'feed-1080x1350.png', width: 1080, height: 1350 },
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

const manifest = [];

for (const route of routes) {
  for (const format of formats) {
    const inputs = route.frames.flatMap((frame) => [
      '-loop', '1', '-t', '5', '-i', path.join(outputRoot, 'meta', `${frame}-${format.suffix}`),
    ]);
    const outputName = `${route.id}-${format.name}-${format.width}x${format.height}.mp4`;
    const outputPath = path.join(videoDir, outputName);
    const filter = [0, 1, 2]
      .map((index) => `[${index}:v]fps=30,format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=4.55:d=0.45[v${index}]`)
      .join(';') + ';[v0][v1][v2]concat=n=3:v=1:a=0[v]';

    await run('/opt/homebrew/bin/ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      ...inputs,
      '-filter_complex', filter,
      '-map', '[v]',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '18',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-r', '30',
      outputPath,
    ]);

    manifest.push({
      filename: `video/${outputName}`,
      title: route.title,
      format: format.name,
      width: format.width,
      height: format.height,
      durationSeconds: 15,
      audio: 'none',
      sourceFrames: route.frames,
      destination: route.destination,
      utmCampaign: route.campaign,
      productionNote: 'Motion-still launch cut using source-preserved real photography. Replace with real on-site footage when captured.',
    });
  }
}

await writeFile(
  path.join(outputRoot, 'video-manifest.json'),
  `${JSON.stringify({ createdAt: new Date().toISOString(), items: manifest }, null, 2)}\n`,
  'utf8',
);

console.log(`Rendered ${manifest.length} silent motion-still videos to ${videoDir}`);
