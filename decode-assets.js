import fs from 'fs';
import path from 'path';

const chunksDir = path.join(process.cwd(), 'assets_chunks');
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

['critical', 'essentials', 'secondary'].forEach(name => {
  const zipPath = path.join(publicDir, `${name}.zip`);
  let b64Data = '';
  
  if (fs.existsSync(chunksDir)) {
    const files = fs.readdirSync(chunksDir).filter(f => f.startsWith(`${name}_`)).sort();
    if (files.length > 0) {
      files.forEach(file => {
        b64Data += fs.readFileSync(path.join(chunksDir, file), 'utf8');
      });
      const binaryData = Buffer.from(b64Data, 'base64');
      fs.writeFileSync(zipPath, binaryData);
      console.log(`Decoded ${name}.zip from ${files.length} chunks`);
    } else {
      console.warn(`Warning: No chunks found for ${name}`);
    }
  } else {
    console.warn(`Warning: ${chunksDir} not found`);
  }
});
