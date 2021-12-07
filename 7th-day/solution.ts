const text = await Deno.readTextFile("./input.txt");

const positions = text.split(",").map((string) => parseInt(string, 10));

const maxPosition = positions.reduce((acc, curr) => Math.max(acc, curr), 0);
const minPosition = positions.reduce((acc, curr) => Math.min(acc, curr), 0);

let result = maxPosition * positions.length + 1;

for (let i = minPosition; i <= maxPosition; i++) {
  const localSum = positions.reduce(
    (prev, position) => prev + Math.abs(i - position),
    0
  );

  if (localSum < result) {
    result = localSum;
  }
}

console.log("Min fuel:");
console.log(result);
