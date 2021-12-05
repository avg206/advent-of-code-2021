const text = await Deno.readTextFile("./input.txt");

const renderArray = (array: number[][]) => {
  console.log(
    JSON.stringify(
      array.map((line) =>
        line.map((number) => (number === 0 ? "." : number)).join(" ")
      ),
      null,
      2
    )
  );
};

const lines = text
  .split("\n")
  .map((string) =>
    string
      .split(" -> ")
      .map((string) => string.split(",").map((string) => parseInt(string, 10)))
  );

const maxNumber =
  lines.reduce(
    (prev, line) =>
      Math.max(
        prev,
        Math.max.apply(null, line[0]),
        Math.max.apply(null, line[1])
      ),
    0
  ) + 1;

const array: number[][] = new Array(maxNumber)
  .fill(0)
  .map(() => new Array(maxNumber).fill(0));

lines.forEach((line) => {
  let [[x1, y1], [x2, y2]] = line;

  if (x1 !== x2 && y1 !== y2) {
    if (Math.abs(x1 - x2) !== Math.abs(y1 - y2)) {
      return;
    }

    let y = y1;
    let x = x1;
    let yDiff = y2 - y1 > 0 ? 1 : -1;
    let xDiff = x2 - x1 > 0 ? 1 : -1;

    while (y !== y2 && x !== x2) {
      array[y][x]++;

      y += yDiff;
      x += xDiff;
    }

    array[y][x]++;

    return;
  }

  if (x1 === x2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      array[y][x1]++;
    }
    return;
  }

  if (y1 === y2) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      array[y1][x]++;
    }
    return;
  }
});

let result = 0;

for (let i = 0; i < maxNumber; i++) {
  for (let j = 0; j < maxNumber; j++) {
    if (array[i][j] > 1) {
      result++;
    }
  }
}

// console.log("Array:");
// renderArray(array);
console.log("Result:");
console.log(result);
