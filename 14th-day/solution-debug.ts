const text = await Deno.readTextFile("./input.txt");

const lines = text.split("\n");

const countFrequents = (string: string): Record<string, number> => {
  const frequents: Record<string, number> = {};

  for (const char of string) {
    if (!frequents[char]) {
      frequents[char] = 0;
    }

    frequents[char]++;
  }

  return frequents;
};

let template = lines[0];

lines.shift();
lines.shift();

const pairs = lines.reduce<Record<string, string>>((acc, line) => {
  const [from, to] = line.split(" -> ");

  acc[from] = to;

  return acc;
}, {});

const LIMIT_OF_DAYS = 10;

for (let i = 1; i <= LIMIT_OF_DAYS; i++) {
  let newString = template;
  let insertionCount = 0;

  for (let j = 0; j < template.length - 1; j++) {
    const pair = template[j] + template[j + 1];

    if (!pairs[pair]) {
      continue;
    }

    newString =
      newString.substring(0, j + insertionCount + 1) +
      pairs[pair] +
      newString.substring(j + insertionCount + 1);
    insertionCount++;
  }

  template = newString;

  console.log(`Day ${i}:`);
  console.log(countFrequents(template));
}

const frequents = countFrequents(template);

console.log("Answer:");
console.log(
  Math.max.apply(null, Object.values(frequents)) -
    Math.min.apply(null, Object.values(frequents))
);
