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
  const map = data.split('\n').filter(x => x != "").map(line => line.split(''));

  const startY = map.findIndex(row => row.includes('^'));
  const startX = map[startY].indexOf('^');

  const width = map[0].length;
  const height = map.length;

  let [x, y] = [startX, startY];
  let [dirX, dirY] = [0, -1];

  while (0 <= x && x < width && 0 <= y && y < height) {
    // map.map(line => line.reduce((acc, char) => acc + char), '').map(line => console.log(line));
    // console.log();

  
    if (map[y][x] === '#') {
      x -= dirX;
      y -= dirY;

      [dirX, dirY] = rotateRight(dirX, dirY);
    }
    
    map[y][x] = 'X';
    x += dirX;
    y += dirY;
  }

  const positions = map.map(line => line.filter(char => char === 'X').length).reduce((acc, n) => acc+n, 0);
  console.log('positions:', positions);

  let possibleObstacles = 0;
  for (const [obstacleY, row] of map.entries()) {
    for (const [obstacleX, before] of row.entries()) {
      if (before !== 'X') {
        continue;
      }

      map[obstacleY][obstacleX] = '#';

      if (checkLoop(map, startX, startY, 0, -1)) {
        possibleObstacles++;
      }

      map[obstacleY][obstacleX] = before;
    }
  }

  console.log('possibleObstacles:', possibleObstacles);

}

function checkLoop(map, x, y, dirX, dirY) {
  const knownStates = {};

  const width = map[0].length;
  const height = map.length;
  
  while (0 <= x && x < width && 0 <= y && y < height) {
    const state = `${x}/${y}/${dirX}/${dirY}`;
    if (state in knownStates) {
      return true;
    }

    knownStates[state] = true;
  
    if (map[y][x] === '#') {
      x -= dirX;
      y -= dirY;

      [dirX, dirY] = rotateRight(dirX, dirY);
    }
    
    x += dirX;
    y += dirY;
  }

  return false;
}

function rotateRight(dirX, dirY) {
  if (dirY !== 0) {
    return [-dirY, -dirX];
  } else {
    return [dirY, dirX];
  }
}
