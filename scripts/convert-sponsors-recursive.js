import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sponsorsDir = path.resolve('public/assets/sponsors');

// Recursively find all PNG files
function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.toLowerCase().endsWith('.png')) {
      results.push(filePath);
    }
  });
  return results;
}

async function convertPngToWebp() {
  try {
    if (!fs.existsSync(sponsorsDir)) {
      console.log('Sponsors directory does not exist.');
      return;
    }

    const pngFiles = getFilesRecursively(sponsorsDir);

    if (pngFiles.length === 0) {
      console.log('No PNG files found in public/assets/sponsors/ or its subfolders.');
      return;
    }

    console.log(`Found ${pngFiles.length} PNG file(s). Starting conversion...`);

    for (const filePath of pngFiles) {
      const dir = path.dirname(filePath);
      const file = path.basename(filePath);
      const outputName = path.basename(file, path.extname(file)) + '.webp';
      const outputPath = path.join(dir, outputName);

      console.log(`Converting: ${filePath} -> ${outputPath}`);

      await sharp(filePath)
        .webp({ quality: 85, lossless: false })
        .toFile(outputPath);

      console.log(`Successfully converted ${file}. Removing original PNG...`);
      fs.unlinkSync(filePath);
    }

    console.log('All conversions complete!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertPngToWebp();
