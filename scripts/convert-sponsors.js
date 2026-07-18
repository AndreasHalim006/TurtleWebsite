import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sponsorsDir = path.resolve('public/assets/sponsors');

// Ensure directory exists
if (!fs.existsSync(sponsorsDir)) {
  fs.mkdirSync(sponsorsDir, { recursive: true });
  console.log(`Created directory: ${sponsorsDir}`);
}

async function convertPngToWebp() {
  try {
    const files = fs.readdirSync(sponsorsDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    if (pngFiles.length === 0) {
      console.log('No PNG files found in public/assets/sponsors/');
      return;
    }

    console.log(`Found ${pngFiles.length} PNG file(s). Starting conversion...`);

    for (const file of pngFiles) {
      const inputPath = path.join(sponsorsDir, file);
      const outputName = path.basename(file, path.extname(file)) + '.webp';
      const outputPath = path.join(sponsorsDir, outputName);

      console.log(`Converting: ${file} -> ${outputName}`);

      await sharp(inputPath)
        .webp({ quality: 85, lossless: false })
        .toFile(outputPath);

      console.log(`Successfully converted ${file}. Removing original PNG...`);
      fs.unlinkSync(inputPath);
    }

    console.log('All conversions complete!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertPngToWebp();
