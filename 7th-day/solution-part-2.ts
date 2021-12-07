const text = await Deno.readTextFile("./input.txt");

const positions = text.split(",").map((string) => parseInt(string, 10));

const maxPosition = Math.max.apply(null, positions);
const minPosition = Math.min.apply(null, positions);

let result = Number.POSITIVE_INFINITY;

for (let i = minPosition; i <= maxPosition; i++) {
  const localSum = positions.reduce((prev, position) => {
    const diff = Math.abs(i - position);
    return prev + ((1 + diff) * diff) / 2;
  }, 0);

  if (localSum < result) {
    result = localSum;
  }
}

console.log("Min fuel:");
console.log(result);
