const text = await Deno.readTextFile("./input.txt");

const lines = text.trim().split("\n");

interface Point {
  x: number;
  y: number;
  z: number;
}

class Cube {
  public x1: number;
  public x2: number;

  public y1: number;
  public y2: number;

  public z1: number;
  public z2: number;

  constructor(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    z1: number,
    z2: number
  ) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.z1 = z1;
    this.z2 = z2;
  }

  volume() {
    return (
      Math.abs(this.x2 - this.x1) *
      Math.abs(this.y2 - this.y1) *
      Math.abs(this.z2 - this.z1)
    );
  }

  contains(cube: Cube) {
    return (
      cube.x1 >= this.x1 &&
      cube.x2 <= this.x2 &&
      cube.y1 >= this.y1 &&
      cube.y2 <= this.y2 &&
      cube.z1 >= this.z1 &&
      cube.z2 <= this.z2
    );
  }

  intersect(cube: Cube) {
    return (
      cube.x1 <= this.x2 &&
      cube.x2 >= this.x1 &&
      cube.y1 <= this.y2 &&
      cube.y2 >= this.y1 &&
      cube.z1 <= this.z2 &&
      cube.z2 >= this.z1
    );
  }
}

const parseLine = (line: string): [Cube, string] => {
  const parseDiff = (string: string): number[] =>
    string
      .split("=")[1]
      .split("..")
      .map((number) => parseInt(number, 10));

  console.log("Process line", line);
  const [action, coords] = line.split(" ");
  const [[x1, x2], [y1, y2], [z1, z2]] = coords.split(",").map(parseDiff);

  return [new Cube(x1, x2 + 1, y1, y2 + 1, z1, z2 + 1), action];
};

const substrateCube = (cube1: Cube, cube2: Cube): Cube[] => {
  if (cube2.contains(cube1)) {
    return [];
  }

  if (!cube1.intersect(cube2)) {
    return [cube1];
  }

  const newCubs = [];

  const breaksX = Array.from(new Set([cube1.x1, cube1.x2, cube2.x1, cube2.x2]))
    .sort((a, b) => a - b)
    .filter((x) => x >= cube1.x1 && x <= cube1.x2);

  const breaksY = Array.from(new Set([cube1.y1, cube1.y2, cube2.y1, cube2.y2]))
    .sort((a, b) => a - b)
    .filter((y) => y >= cube1.y1 && y <= cube1.y2);

  const breaksZ = Array.from(new Set([cube1.z1, cube1.z2, cube2.z1, cube2.z2]))
    .sort((a, b) => a - b)
    .filter((y) => y >= cube1.z1 && y <= cube1.z2);

  for (let i = 0; i < breaksX.length - 1; i++) {
    for (let j = 0; j < breaksY.length - 1; j++) {
      for (let k = 0; k < breaksZ.length - 1; k++) {
        newCubs.push(
          new Cube(
            breaksX[i],
            breaksX[i + 1],
            breaksY[j],
            breaksY[j + 1],
            breaksZ[k],
            breaksZ[k + 1]
          )
        );
      }
    }
  }

  return newCubs.filter((cube) => !cube2.contains(cube));
};

let cubes: Cube[] = [];

for (const line of lines) {
  const [newCub, action] = parseLine(line);

  cubes = cubes.flatMap((cube) => substrateCube(cube, newCub));

  if (action === "on") {
    cubes.push(newCub);
  }
}

console.log("Cubes count:");
console.log(cubes.length);
console.log("Total volume:");
console.log(
  cubes.map((cube) => cube.volume()).reduce((acc, volume) => acc + volume, 0)
);
