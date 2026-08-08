import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'assets_b64');
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

['critical', 'essentials', 'secondary'].forEach(name => {
  const b64Path = path.join(assetsDir, `${name}.zip.b64`);
  const zipPath = path.join(publicDir, `${name}.zip`);

  if (fs.existsSync(b64Path)) {
    const b64Data = fs.readFileSync(b64Path, 'utf8');
    const binaryData = Buffer.from(b64Data, 'base64');
    fs.writeFileSync(zipPath, binaryData);
    console.log(`Decoded ${name}.zip`);
  } else {
    console.warn(`Warning: ${b64Path} not found`);
  }
});
