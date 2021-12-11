const text = await Deno.readTextFile("./input.txt");

const octMap = text
  .split("\n")
  .map((line) => line.split("").map((number) => parseInt(number, 10)));

const MOVES = [
  [-1, 1],
  [-1, -1],
  [-1, 0],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [0, 1],
];

const n = octMap.length;

for (let day = 1; true; day++) {
  const flashMap = new Array(n).fill(0).map(() => new Array(n).fill(0));
  const queue = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      octMap[i][j]++;

      if (octMap[i][j] > 9) {
        queue.push([i, j]);
      }
    }
  }

  while (queue.length) {
    const topElement = queue.shift();
    if (!topElement) {
      throw new Error("Queue is broken");
    }
    const [i, j] = topElement;

    if (flashMap[i][j] === 1) {
      continue;
    }

    flashMap[i][j] = 1;

    MOVES.forEach(([dI, dJ]) => {
      const nI = i + dI;
      const nJ = j + dJ;

      if (nI < 0 || nI === n || nJ < 0 || nJ === n) {
        return;
      }

      octMap[nI][nJ]++;

      if (octMap[nI][nJ] > 9) {
        queue.push([nI, nJ]);
      }
    });
  }

  let localFlashCount = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (octMap[i][j] > 9) {
        localFlashCount++;
      }

      octMap[i][j] = octMap[i][j] > 9 ? 0 : octMap[i][j];
    }
  }

  if (localFlashCount === n * n) {
    console.log("Expected day:");
    console.log(day);
    break;
  }
}
