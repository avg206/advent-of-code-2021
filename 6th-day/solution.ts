const text = await Deno.readTextFile("./input.txt");

const fish = text.split(",").map((string) => parseInt(string, 10));

const DAYS_LIMIT = 256;
let days = 0;

while (days < DAYS_LIMIT) {
  let i = 0;
  let length = fish.length;

  while (i < length) {
    if (fish[i] === 0) {
      fish[i] = 6;
      fish.push(8);
    } else {
      fish[i]--;
    }

    i++;
  }

  days++;
}

console.log("Fish count:");
console.log(fish.length);
console.log("Fish:");
console.log(fish);
