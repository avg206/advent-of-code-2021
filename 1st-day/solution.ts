const text = await Deno.readTextFile("./input.txt");

const depths = text
  .split("\n")
  .map((string) => parseInt(string, 10));

let result = 0;

for (let i = 1; i < depths.length; i++) {
  if (depths[i] - depths[i - 1] > 0) {
    result++;
  }
}

console.log(result);
