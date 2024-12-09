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
  const equations = data.split('\n').filter(line => line !== '').map(line => {
    const [result, ...operands] = line.split(' ').map(x => parseInt(x));
    return {
      result: result,
      operands: operands,
    };
  })

  const satisfiableEquations = equations.filter(({ result, operands}) => hasSatisfiableOperators(result, null, operands, false, 0))

  console.log('satisfiableEquations sum:', satisfiableEquations.reduce((acc, curr) => acc + curr.result, 0))

  const satisfiableEquationsWithConcat = equations.filter(({ result, operands}) => hasSatisfiableOperators(result, null, operands, true, 0))

  console.log('satisfiableEquationsWithConcat sum:', satisfiableEquationsWithConcat.reduce((acc, curr) => acc + curr.result, 0))

}

function hasSatisfiableOperators(desiredResult, acc, operands, withConcat, currentIndex) {
  if (acc > desiredResult) {
    return false;
  }

  if (currentIndex >= operands.length) {
    return desiredResult === acc;
  }

  const currentOperand = operands[currentIndex];
  
  if (currentIndex === 0) {
    return hasSatisfiableOperators(desiredResult, currentOperand, operands, withConcat, currentIndex+1);
  }

  return (
    hasSatisfiableOperators(desiredResult, acc * currentOperand, operands, withConcat, currentIndex+1) ||
    hasSatisfiableOperators(desiredResult, acc + currentOperand, operands, withConcat, currentIndex+1) ||
    (withConcat && hasSatisfiableOperators(desiredResult, parseInt(`${acc}${currentOperand}`), operands, withConcat, currentIndex+1))
  );
}
