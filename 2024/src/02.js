import fs from 'node:fs/promises';

if (process.argv.length != 3) {
  console.error('Usage: node [day].js input-file.js');
  process.exit(1);
}

const inputFileName = process.argv[2];

main(
  inputFileName,
);

const SAFE_EITHER = 1
const SAFE_DECREASING = 2
const SAFE_INCREASING = 3
const UNSAFE = 4

async function main(
  fileName,
) {
  const data = await fs.readFile(fileName, 'utf-8');
  const lines = data.split('\n');

  let reports = [];

  for (const line of lines) {
    if (line == "") {
      break;
    }

    reports.push(line.split(' ').map(x => parseInt(x)));
  }

  const safeReports = reports.filter(isSafeReport);

  console.log('Safe reports:', safeReports.length);

  const safeReportsWithProblemDampener = reports.filter(report => {
    if (isSafeReport(report)) {
      return true;
    }

    for (const i in report) {
      const reportFiltered = report.filter((_, index) => index != i);
      
      if (isSafeReport(reportFiltered)) {
        return true;
      }
    }

    return false;
  });

  console.log('Safe reports with Problem Dampener:', safeReportsWithProblemDampener.length);
}

function isSafeReport(report) {
  return report.reduce((acc, x) => {
    if (acc.state === UNSAFE) {
      return { state: UNSAFE };
    }

    if (acc.prev === null) {
      return {
        state: SAFE_EITHER,
        prev: x
      }
    }

    if (x === acc.prev || Math.abs(x - acc.prev) > 3) {
      return { state: UNSAFE };
    }

    if (x > acc.prev) {
      if (acc.state === SAFE_DECREASING) {
        return { state: UNSAFE };
      }

      return { state: SAFE_INCREASING, prev: x };
    }
    
    // x < prev

    if (acc.state === SAFE_INCREASING) {
      return { state: UNSAFE };
    }

    return { state: SAFE_DECREASING, prev: x };
  }, {state: SAFE_EITHER, prev: null}).state !== UNSAFE;
}
