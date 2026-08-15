import fs from 'fs';
import https from 'https';

const urls = [
  'https://raw.githubusercontent.com/datturbomoon/Mystic-Draw/master/shuffle.mp3',
  'https://raw.githubusercontent.com/datturbomoon/Mystic-Draw/main/shuffle.mp3'
];
const dest = 'public/card_shuffle.mp3';

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    console.log(`Trying to download from: ${url}...`);
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Download successful! Saved to ${dest}`);
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        console.log(`Failed with status: ${response.statusCode}`);
        resolve(false); // Try next url
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      console.log(`Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  for (const url of urls) {
    const success = await downloadFile(url);
    if (success) {
      console.log('Shuffle sound successfully downloaded!');
      process.exit(0);
    }
  }
  console.error('All download URLs failed.');
  process.exit(1);
}

main();
