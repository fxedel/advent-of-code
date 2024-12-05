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
  const lines = data.split('\n').filter(x => x != "");

  let xmasCount = 0;
  let x_masCount = 0;

  for (const [y, line] of lines.entries()) {
    for (const match of line.matchAll(/X/g)) {
      const x = match.index;

      xmasCount += [
        walkMatrix(lines, x, y, 1, 0), // to right
        walkMatrix(lines, x, y, 1, 1), // to bottom-right
        walkMatrix(lines, x, y, 0, 1), // to bottom
        walkMatrix(lines, x, y, -1, 1), // to bottom-left
        walkMatrix(lines, x, y, -1, 0), // to left
        walkMatrix(lines, x, y, -1, -1), // to top-left
        walkMatrix(lines, x, y, 0, -1), // to top
        walkMatrix(lines, x, y, 1, -1), // to top-right
      ].filter(x => x === "XMAS").length;
    }

    for (const match of line.matchAll(/A/g)) {
      const x = match.index;

      const topLeftBottomRight = walkMatrix(lines, x-1, y-1, 1, 1, 3);
      const bottomLeftTopRight = walkMatrix(lines, x-1, y+1, 1, -1, 3);

      // const mas = [
      //   walkMatrix(lines, x-1, y-1, 1, 1, 3), // top-left to bottom-right
      //   walkMatrix(lines, x+1, y+1, -1, -1, 3), // bottom-right to top-left
      //   walkMatrix(lines, x-1, y+1, 1, -1, 3), // bottom-left to top-right
      //   walkMatrix(lines, x+1, y-1, -1, 1, 3), // top-right to bottom-left
      // ];

      const isXmasCross = (topLeftBottomRight === "MAS" || topLeftBottomRight === "SAM") && (bottomLeftTopRight === "MAS" || bottomLeftTopRight === "SAM");

      if (isXmasCross) {
        x_masCount++;
      }

    }
  }

  console.log('xmasCount:', xmasCount);
  console.log('x_masCount:', x_masCount);

}

function walkMatrix(matrix, startX, startY, stepX, stepY, steps = 4) {
  let word = "";

  let [x, y] = [startX, startY];

  for (let i = 0; i < steps; i++) {
    const value = (matrix[y] ?? [])[x];
    if (value === undefined) {
      return null
    }

    word += value;
    x += stepX;
    y += stepY;
  }

  return word;
}
