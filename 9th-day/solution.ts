const text = await Deno.readTextFile("./input.txt");

const map = text.split("\n").reduce<number[][]>((prev, curr) => {
  prev.push(curr.split("").map((string) => parseInt(string, 10)));
  return prev;
}, []);

const n = map.length;
const m = map[0].length;
const result: number[] = [];
let result2: number[] = [];

const MOVES = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const BFF = (x: number, y: number): number => {
  const localMap = map.map((line) => line.map(() => 0));
  const queue = [[x, y]];
  let size = 0;

  do {
    const topElement = queue.shift();
    if (!topElement) {
      break;
    }

    size++;
    const [x, y] = topElement;
    localMap[x][y] = 1;

    MOVES.forEach(([dX, dY]) => {
      const nX = x + dX;
      const nY = y + dY;

      if (nX < 0 || nX === n || nY < 0 || nY === m) {
        return;
      }

      if (map[nX][nY] != 9 && localMap[nX][nY] === 0) {
        localMap[nX][nY] = 1;
        queue.push([nX, nY]);
      }
    });
  } while (true);

  return size;
};

for (let x = 0; x < n; x++) {
  for (let y = 0; y < m; y++) {
    const value = map[x][y];
    let isLowest = true;

    MOVES.forEach(([dX, dY]) => {
      const nX = x + dX;
      const nY = y + dY;

      if (nX < 0 || nX === n || nY < 0 || nY === m) {
        return;
      }

      if (value >= map[nX][nY]) {
        isLowest = false;
      }
    });

    if (isLowest) {
      result.push(value);
      result2.push(BFF(x, y));
    }
  }
}

result2 = result2.sort((a, b) => b - a);

console.log("Answer1:");
console.log(result.reduce((prev, curr) => prev + curr + 1, 0));
console.log("Answer2:");
console.log(result2[0] * result2[1] * result2[2]);
