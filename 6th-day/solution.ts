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

const fishes = text.split(",").map((string) => parseInt(string, 10));

const DAYS_LIMIT = 256;
let days = 0;

while (days < DAYS_LIMIT) {
  let i = 0;
  let length = fishes.length;

  while (i < length) {
    if (fishes[i] === 0) {
      fishes[i] = 6;
      fishes.push(8);
    } else {
      fishes[i]--;
    }

    i++;
  }

  days++;
}

console.log("Fish count:");
console.log(fishes.length);
console.log("Fish:");
console.log(fishes);
