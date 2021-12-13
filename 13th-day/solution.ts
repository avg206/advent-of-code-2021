const text = await Deno.readTextFile("./input.txt");

const dots: [number, number][] = [];
const lines = text.split("\n");

let maxX = 0;
let maxY = 0;

while (true) {
  const line = lines.shift();
  if (line === "" || !line) {
    break;
  }

  const [x, y] = line.split(",").map((number) => parseInt(number, 10));

  dots.push([y, x]);

  maxX = Math.max(maxX, x + 1);
  maxY = Math.max(maxY, y + 1);
}

const board = new Array(maxY).fill(0).map(() => new Array(maxX).fill(0));

for (const dot of dots) {
  board[dot[0]][dot[1]] = 1;
}

const renderBoard = () => {
  for (let i = 0; i < maxY; i++) {
    let line = "";

    for (let j = 0; j < maxX; j++) {
      if (board[i][j] === 0) {
        line += "..";
      } else {
        line += "xx";
      }
    }

    console.log(line);
  }
};

const foldHorizontal = (position: number) => {
  for (let i = 0; i < maxX; i++) {
    let diff = 1;

    while (position - diff >= 0 && position + diff < maxY) {
      const upPosition = position - diff;
      const downPosition = position + diff;

      board[upPosition][i] =
        board[upPosition][i] + board[downPosition][i] > 0 ? 1 : 0;

      diff++;
    }
  }

  maxY = position;
};

const foldVertical = (position: number) => {
  for (let i = 0; i < maxY; i++) {
    let diff = 1;

    while (position - diff >= 0 && position + diff < maxX) {
      const leftPosition = position - diff;
      const rightPosition = position + diff;

      board[i][leftPosition] =
        board[i][leftPosition] + board[i][rightPosition] > 0 ? 1 : 0;

      diff++;
    }
  }

  maxX = position;
};

const dotsCount = () => {
  let result = 0;

  for (let i = 0; i < maxY; i++) {
    for (let j = 0; j < maxX; j++) {
      result += board[i][j];
    }
  }

  return result;
};

for (const fold of lines) {
  const [_1, _2, line] = fold.split(" ");
  const [direction, position] = line.split("=");

  if (direction === "y") {
    foldHorizontal(parseInt(position, 10));
  }

  if (direction === "x") {
    foldVertical(parseInt(position, 10));
  }

  console.log("Fold -", line);
  console.log(dotsCount());
}

console.log("Board:");
renderBoard();
