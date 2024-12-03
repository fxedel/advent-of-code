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
  const lines = data.split('\n');

  let result = 0;
  let resultWithDosAndDonts = 0;

  let enabled = true;

  for (const line of lines) {
    if (line == "") {
      break;
    }
  
    for (const match of line.matchAll(/mul\((?<x>\d+),(?<y>\d+)\)|do\(\)|don't\(\)/g)) {
      const text = match[0];

      if (text === 'do()') {
        enabled = true;
        continue;
      }

      if (text === "don't()") {
        enabled = false;
        continue;
      }

      result += match.groups.x*match.groups.y;
      if (enabled) {
        resultWithDosAndDonts += match.groups.x*match.groups.y;
      }
    }

  }

  console.log('result:', result);
  console.log('resultWithDosAndDonts:', resultWithDosAndDonts);

}
