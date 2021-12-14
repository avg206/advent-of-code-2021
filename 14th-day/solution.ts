const text = await Deno.readTextFile("./input.txt");

const lines = text.split("\n");

let template = lines[0];

lines.shift();
lines.shift();

const changePairs = lines.reduce<Record<string, string>>((acc, line) => {
  const [from, to] = line.split(" -> ");

  acc[from] = to;

  return acc;
}, {});

let pairsMap: Record<string, number> = {};
const frequents: Record<string, number> = {};

for (let i = 0; i < template.length - 1; i++) {
  const pair = template[i] + template[i + 1];

  pairsMap[pair] = (pairsMap[pair] || 0) + 1;
}

for (const char of template) {
  if (!frequents[char]) {
    frequents[char] = 0;
  }

  frequents[char]++;
}

const LIMIT_OF_DAYS = 40;

for (let i = 1; i <= LIMIT_OF_DAYS; i++) {
  const newPairsMap = { ...pairsMap };

  for (const pair of Object.keys(pairsMap)) {
    if (!changePairs[pair] || pairsMap[pair] === 0) {
      continue;
    }

    const count = pairsMap[pair];
    const newChar = changePairs[pair];

    const leftPair = pair[0] + newChar;
    const rightPair = newChar + pair[1];

    newPairsMap[pair] -= count;
    newPairsMap[leftPair] = (newPairsMap[leftPair] || 0) + count;
    newPairsMap[rightPair] = (newPairsMap[rightPair] || 0) + count;

    frequents[newChar] = (frequents[newChar] || 0) + count;
  }

  pairsMap = newPairsMap;
}

console.log("Answer:");
console.log(
  Math.max.apply(null, Object.values(frequents)) -
    Math.min.apply(null, Object.values(frequents))
);
