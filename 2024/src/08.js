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
  const lines = data.split('\n').filter(x => x !== '');

  const width = lines[0].length;
  const height = lines.length;

  /** @type {Object<string, [number, number][]>} */
  const antennasByFrequency = {};

  const antinodes = new Set();
  const antinodesWithResonantHarmonics = new Set();

  for (const [y, line] of lines.entries()) {
    for (const [x, char] of line.split('').entries()) {
      if (char === '.') {
        continue;
      }

      if (!(char in antennasByFrequency)) {
        antennasByFrequency[char] = []
      }

      const antennas = antennasByFrequency[char];

      for (const antenna of antennas) {
        const [otherX, otherY] = antenna;

        for (let i = 0; true; i++) {
          const newX = otherX - i*(x - otherX);
          const newY = otherY - i*(y - otherY);
          if (checkBounds(width, height, newX, newY)) {
            if (i === 1) {
              antinodes.add(`${newX}/${newY}`);
            }

            antinodesWithResonantHarmonics.add(`${newX}/${newY}`);
          } else {
            break;
          }
        }

        for (let i = 0; true; i++) {
          const newX = x + i*(x - otherX);
          const newY = y + i*(y - otherY);
          if (checkBounds(width, height, newX, newY)) {
            if (i === 1) {
              antinodes.add(`${newX}/${newY}`);
            }

            antinodesWithResonantHarmonics.add(`${newX}/${newY}`);
          } else {
            break;
          }
        }

      }

      antennas.push([x, y]);
    }
  }

  console.log('antinodes:', antinodes.size);
  console.log('antinodesWithResonantHarmonics:', antinodesWithResonantHarmonics.size);

}

function checkBounds(width, height, x, y) {
  return 0 <= x && x < width && 0 <= y && y < height;
}
