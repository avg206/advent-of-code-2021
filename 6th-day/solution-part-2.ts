const text = await Deno.readTextFile("./input.txt");

const fish = text.split(",").map((string) => parseInt(string, 10));

let map = fish.reduce(
  (acc, curr) => {
    acc[curr]++;
    return acc;
  },
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
);

const DAYS_LIMIT = 256;
let days = 0;

console.log(map)

while (days < DAYS_LIMIT) {
  const newMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  map.forEach((count, value) => {
    if (value === 0) {
      newMap[8] += count;
      newMap[6] += count;
    } else {
      newMap[value - 1] += count;
    }
  });

  map = newMap

  days++;
}

console.log("Fish count:");
console.log(map.reduce((prev, curr) => prev + curr, 0));
console.log("Fish map:");
console.log(map);
