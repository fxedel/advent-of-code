import fs from 'node:fs/promises';

if (process.argv.length != 3) {
  console.error('Usage: node [day].js input-file.js');
  process.exit(1);
}

const inputFileName = process.argv[2];

main(
  inputFileName,
);

async function main(
  fileName,
) {
  const data = await fs.readFile(fileName, 'utf-8');
  const [diskMap] = data.split('\n');

  const filesystem = [];
  
  for (const [i, char] of diskMap.split('').entries()) {
    for (let j = 0; j < parseInt(char); j++) {
      if (i % 2 === 0) {
        filesystem.push(i/2);
      } else {
        filesystem.push('.');
      }
    }
  }
  
  for (let i = filesystem.length - 1; i >= 0; i--) {
    const char = filesystem[i];

    if (char !== '.') {
      const movedPosition = filesystem.findIndex(x => x === '.');
      if (movedPosition === -1) {
        break;
      }

      filesystem[movedPosition] = char;
    }

    filesystem.pop();
  }

  const checkSum = filesystem.reduce((acc, char, i) => acc + i * parseInt(char), 0);

  console.log('checkSum:', checkSum)

}
