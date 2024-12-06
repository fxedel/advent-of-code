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
  const [linesRules, linesUpdates] = data.split('\n\n', 2).map(x => x.split('\n'));

  const rules = {};
  for (const line of linesRules) {
    rules[line] = true;
  }

  let resultCorrectUpdates = 0;
  let resultIncorrectUpdates = 0;

  for (const line of linesUpdates) {
    if (line == "") {
      break;
    }

    const pages = line.split(',').map(x => parseInt(x));

    const isValid = pages.every((page, i) => (pages.every((otherPage, j) =>
      !(i < j) || rules[`${page}|${otherPage}`]
    )));
    
    if (isValid) {
      resultCorrectUpdates += pages[(pages.length-1)/2];
    } else {
      const remainingPages = pages;
      const sortedPages = [];

      while (remainingPages.length > 0) {
        const firstPageIndex = remainingPages.findIndex(page => (remainingPages.every(otherPage =>
          page === otherPage || rules[`${page}|${otherPage}`]
        )));

        const [firstPage] = remainingPages.splice(firstPageIndex, 1);
        sortedPages.push(firstPage);
      }

      resultIncorrectUpdates += sortedPages[(sortedPages.length-1)/2];
    }
  }

  console.log('resultCorrectUpdates:', resultCorrectUpdates);
  console.log('resultIncorrectUpdates:', resultIncorrectUpdates);

}
