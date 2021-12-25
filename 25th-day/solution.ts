const text = await Deno.readTextFile("./input.txt");
const lines = text.trim().split("\n");

const createMap = (n: number, m: number): string[][] =>
  new Array(n).fill(0).map(() => new Array(m).fill("."));

const n = lines.length;
const m = lines[0].length;
let field = createMap(n, m);

for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    field[i][j] = lines[i][j];
  }
}

let step = 0;
let hasMoved = false;

do {
  step++;
  hasMoved = false;
  const newField = createMap(n, m);

  // > - move
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (field[i][j] !== ">") {
        continue;
      }

      const nextJ = (j + 1) % m;

      if (field[i][nextJ] === ".") {
        newField[i][nextJ] = ">";
        hasMoved = true;
      } else {
        newField[i][j] = ">";
      }
    }
  }

  // v - move
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (field[i][j] !== "v") {
        continue;
      }

      const nextI = (i + 1) % n;

      if (field[nextI][j] !== "v" && newField[nextI][j] === ".") {
        newField[nextI][j] = "v";
        hasMoved = true;
      } else {
        newField[i][j] = "v";
      }
    }
  }

  field = newField;
} while (hasMoved === true);

console.log("Last step -", step);
