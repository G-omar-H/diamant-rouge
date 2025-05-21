import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import path from 'path';
import fs from 'fs/promises';
import { promisify } from 'util';
import glob from 'glob';

const globAsync = promisify(glob);

async function cleanTmpFiles(dir) {
  const tmpFiles = await globAsync(`${dir}/**/*.tmp`);
  await Promise.all(tmpFiles.map(file => fs.unlink(file)));
  console.log(`🧹 Deleted ${tmpFiles.length} .tmp files`);
}

async function optimizeImages() {
  const dir = 'public/images/products';
  const files = await fs.readdir(dir);

  const imageFiles = files.filter(f => /\.(jpe?g|png)$/i.test(f));

  for (const file of imageFiles) {
    const filePath = path.join(dir, file);
    const buffer = await fs.readFile(filePath);

    const optimizedBuffer = await imagemin.buffer(buffer, {
      plugins: [
        mozjpeg({ quality: 85, progressive: true }),
        pngquant({ quality: [0.65, 0.8], speed: 1 }),
      ],
    });

    await fs.writeFile(filePath, optimizedBuffer);
    console.log(`✅ Optimized ${file}`);
  }

  await cleanTmpFiles(dir);
}

optimizeImages().catch(console.error);

