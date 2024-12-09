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

  const blocks = diskMap.split('').map((char, i) => ({
    type: i % 2 === 0 ? 'file' : 'space',
    id: i % 2 === 0 ? i/2 : '.',
    size: parseInt(char)
  }));

  for (let i = blocks.length - 1; i > 0; i--) {
    const block = blocks[i];
    if (block.type === 'space') {
      continue;
    }

    const spaceBlockIndex = blocks.findIndex((spaceBlock, spaceIndex) => spaceIndex < i && spaceBlock.type === 'space' && spaceBlock.size >= block.size);
    if (spaceBlockIndex === -1) {
      continue;
    }

    const spaceBlock = blocks[spaceBlockIndex];
    spaceBlock.size -= block.size;

    // replace current block with space block
    blocks[i] = {
      type: 'space',
      id: '.',
      size: block.size,
    };

    const after = blocks.splice(spaceBlockIndex); // remove blocks after new position
    blocks.push(block); // insert block at new position
    blocks.push(...after); // insert removed blocks

    i++; // blocks have been shifted
  }

  const filesystem = [];

  for (const block of blocks) {
    for (let i = 0; i < block.size; i++) {
      filesystem.push(block.id);
    }
  }

  const checkSum = filesystem.reduce((acc, char, i) => acc + i * parseInt('0' + char), 0);

  console.log('checkSum:', checkSum);

}
