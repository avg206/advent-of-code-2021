const text = await Deno.readTextFile("./input.txt");

const lines = text.trim().split("\n");

const algorithm = lines[0].split("");
lines.shift();
lines.shift();

const n = lines.length;
let map = new Array(n).fill(".").map(() => new Array(n).fill("."));

const Moves: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

lines.forEach((line, i) => {
  line.split("").forEach((sign, j) => {
    map[i][j] = sign;
  });
});

const padArray = (array: string[][], padSign: string): string[][] => {
  const paddedArray = new Array(array.length + 2)
    .fill(padSign)
    .map(() => new Array(array.length + 2).fill(padSign));

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      paddedArray[i + 1][j + 1] = array[i][j];
    }
  }

  return paddedArray;
};

const SimulationDays = 50;
let padSign = "#";

for (let k = 1; k <= SimulationDays; k++) {
  padSign = padSign === "#" ? "." : "#";

  const paddedMap = padArray(padArray(map, padSign), padSign);
  const output = new Array(paddedMap.length)
    .fill(".")
    .map(() => new Array(paddedMap.length).fill("."));

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      paddedMap[i + 2][j + 2] = map[i][j];
    }
  }

  for (let i = 0; i < paddedMap.length; i++) {
    for (let j = 0; j < paddedMap.length; j++) {
      let stringNumber = "";

      for (const [dI, dJ] of Moves) {
        if (
          i === 0 ||
          j === 0 ||
          i === paddedMap.length - 1 ||
          j === paddedMap.length - 1
        ) {
          stringNumber += padSign === "#" ? "1" : "0";
          continue;
        }

        stringNumber += paddedMap[i + dI][j + dJ] === "#" ? "1" : "0";
      }

      output[i][j] = algorithm[parseInt(stringNumber, 2)];
    }
  }

  map = output;
}

let amount = 0;
for (let i = 0; i < map.length; i++) {
  let string = "";

  for (let j = 0; j < map.length; j++) {
    amount += map[i][j] === "#" ? 1 : 0;
    string += map[i][j];
  }

  console.log(string);
}

console.log("Amount of signs:");
console.log(amount);
