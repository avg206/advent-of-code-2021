const text = await Deno.readTextFile("./input.txt");

const depths = text
  .split('\n')
  .map((string) => parseInt(string, 10));

let result = 0;

let firstDepthIndex = 0;
let newDepthIndex = 3;

while (newDepthIndex < depths.length ) {
  if (depths[newDepthIndex] > depths[firstDepthIndex]) {
    result++;
  }

  firstDepthIndex++;
  newDepthIndex++;
}

console.log(result);