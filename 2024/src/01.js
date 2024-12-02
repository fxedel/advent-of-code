import fs from 'node:fs/promises';

async function main(
  fileName,
) {
  const data = await fs.readFile(fileName, 'utf-8');

  const lines = data.split('\n');

  const as = [];
  const bs = [];

  const aFrequencies = {};
  const bFrequencies = {};

  for (const line of lines) {
    if (line == "") {
      break;
    }

    const [a, b] = line.replace(/\s+/, '–').split('–').map(x => parseInt(x));
    as.push(a);
    bs.push(b);

    if (!(a in aFrequencies)) {
      aFrequencies[a] = 0;
    }

    aFrequencies[a]++;

    if (!(b in bFrequencies)) {
      bFrequencies[b] = 0;
    }

    bFrequencies[b]++;
  }

  as.sort();
  bs.sort();

  const distance = as.reduce((acc, a, i) => acc + Math.abs(a - bs[i]), 0)
  
  console.log('Distance:', distance);

  const similarity = Object.entries(aFrequencies).reduce((acc, [a, aCount]) => acc + aCount * a * (bFrequencies[a] ?? 0), 0);

  console.log('Similarity:', similarity);
}

if (process.argv.length != 3) {
  console.error('Usage: node [day].js input-file.js');
  process.exit(1);
}

const inputFileName = process.argv[2];

main(
  inputFileName,
);
