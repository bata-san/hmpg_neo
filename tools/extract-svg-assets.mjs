import fs from 'node:fs';
import path from 'node:path';

const source = process.argv[2];
const destination = process.argv[3] ?? path.resolve('gallary');
const uiDestination = path.resolve('public/ui');

if (!source) throw new Error('Usage: node tools/extract-svg-assets.mjs <svg> [destination]');

const svg = fs.readFileSync(source, 'utf8');
const imageById = new Map();
const imagePattern = /<image\s+id="([^"]+)"[^>]*xlink:href="data:image\/(png|jpe?g);base64,([^"]+)"\s*\/>/g;

for (const match of svg.matchAll(imagePattern)) {
  imageById.set(match[1], { extension: match[2].replace('jpeg', 'jpg'), body: match[3] });
}

const placements = [];
const placementPattern = /<g\s+id="([^"]+)"[^>]*>[\s\S]*?<use\s+xlink:href="#([^"]+)"/g;
for (const match of svg.matchAll(placementPattern)) placements.push({ name: match[1], imageId: match[2] });

fs.mkdirSync(destination, { recursive: true });
fs.mkdirSync(uiDestination, { recursive: true });

for (const directory of [destination, uiDestination]) {
  for (const file of fs.readdirSync(directory)) {
    const cleanName = file.replace(/\.png$/, '');
    if (file.endsWith('.png.png') && fs.existsSync(path.join(directory, cleanName))) {
      fs.unlinkSync(path.join(directory, file));
    }
  }
}

for (const placement of placements) {
  const image = imageById.get(placement.imageId);
  if (!image) continue;
  const safeName = placement.name.replace(/\.[^.]+$/, '').replace(/[<>:"/\\|?*]/g, '_');
  const outputDirectory = placement.name.toLowerCase().includes('support') ? uiDestination : destination;
  fs.writeFileSync(path.join(outputDirectory, `${safeName}.${image.extension}`), Buffer.from(image.body, 'base64'));
}

console.log(`Extracted ${placements.length} image assets into ${destination}`);
