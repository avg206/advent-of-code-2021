const text = await Deno.readTextFile("./input.txt");

const MOVES = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const inputMap = text
  .trim()
  .split("\n")
  .map((line) => line.split("").map((point) => parseInt(point, 10)));

const populateMap = (
  originalMap: number[][],
  populationRatio: number
): number[][] => {
  const originalN = originalMap.length;
  const originalM = originalMap[0].length;

  const n = originalN * populationRatio;
  const m = originalM * populationRatio;

  const map = new Array(n).fill(0).map(() => new Array(m).fill(0));

  for (let x = 0; x < originalN; x++) {
    for (let y = 0; y < originalM; y++) {
      map[x][y] = originalMap[x][y];
    }
  }

  for (let j = 1; j < populationRatio; j++) {
    for (let x = 0; x < originalN; x++) {
      for (let y = 0; y < originalM; y++) {
        const step = j * originalM;
        const stepBack = (j - 1) * originalM;

        map[x][y + step] = map[x][y + stepBack] + 1;
        if (map[x][y + step] > 9) {
          map[x][y + step] = 1;
        }
      }
    }
  }

  for (let i = 0; i < populationRatio; i++) {
    for (let j = 1; j < populationRatio; j++) {
      const yStep = i * originalN;

      for (let x = 0; x < originalN; x++) {
        for (let y = 0; y < originalM; y++) {
          const step = j * originalM;
          const stepBack = (j - 1) * originalM;

          map[x + step][y + yStep] = map[x + stepBack][y + yStep] + 1;
          if (map[x + step][y + yStep] > 9) {
            map[x + step][y + yStep] = 1;
          }
        }
      }
    }
  }

  return map;
};

type Point = [number, number];
interface Node {
  score: number;
  parent: Point | null;
}

const solve = (inputMap: number[][], ratio: number): number => {
  const map = populateMap(inputMap, ratio);
  const n = map.length;
  const m = map[0].length;

  const grid: Node[][] = new Array(n)
    .fill(0)
    .map(() =>
      new Array(m)
        .fill(0)
        .map(() => ({ score: Number.MAX_SAFE_INTEGER, parent: null }))
    );

  grid[0][0].score = map[0][0];

  let openList: Point[] = [[0, 0]];
  const closeList = new Set();

  while (openList.length) {
    const lowerPoint = openList.reduce((min, curr) => {
      if (grid[curr[0]][curr[1]].score < grid[min[0]][min[1]].score) {
        return curr;
      }

      return min;
    }, openList[0]);

    const [x, y] = lowerPoint;

    // End case
    if (x === n - 1 && y === m - 1) {
      return grid[n - 1][m - 1].score - map[0][0];
    }

    openList = openList.filter((point) => point !== lowerPoint);
    closeList.add(`${x}_${y}`);

    for (const [dX, dY] of MOVES) {
      const nX = x + dX;
      const nY = y + dY;

      if (nX < 0 || nX === n || nY < 0 || nY === m) {
        continue;
      }

      if (closeList.has(`${nX}_${nY}`)) {
        continue;
      }

      const score = grid[x][y].score + map[nX][nY];

      if (!openList.find((point) => point[0] === nX && point[1] === nY)) {
        openList.push([nX, nY]);
      }

      if (grid[nX][nY].score > score) {
        grid[nX][nY].score = score;
        grid[nX][nY].parent = lowerPoint;
      }
    }
  }

  throw new Error("No results");
};

console.log("Score for ratio 1");
console.log(solve(inputMap, 1));

console.log("Score for ratio 5");
console.log(solve(inputMap, 5));
