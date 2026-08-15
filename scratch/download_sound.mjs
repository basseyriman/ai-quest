import fs from 'fs';
import https from 'https';
import path from 'path';

const sounds = [
  {
    url: 'https://raw.githubusercontent.com/UnknownEnergy/solitaire/master/card-flip.mp3',
    dest: 'public/card_flip.mp3'
  },
  {
    url: 'https://raw.githubusercontent.com/UnknownEnergy/solitaire/master/card-place.mp3',
    dest: 'public/card_place.mp3'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Starting download from ${url} to ${dest}...`);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${dest} successfully.`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    for (const sound of sounds) {
      await downloadFile(sound.url, sound.dest);
    }
    console.log('All downloads completed!');
  } catch (err) {
    console.error('Error in downloads:', err);
    process.exit(1);
  }
}

main();
