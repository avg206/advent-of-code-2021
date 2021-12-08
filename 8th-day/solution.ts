const text = await Deno.readTextFile("./input.txt");

const processLine = (line: string): number => {
  const [digits, input] = line.split(" | ");

  const inputDigs = input.split(" ");

  return inputDigs.filter((string) => [2, 3, 4, 7].includes(string.length))
    .length;
};

const lines = text.split("\n");

const answer = lines.reduce((acc, line) => acc + processLine(line), 0);

console.log("Count of 1,4,7,8:");
console.log(answer);
