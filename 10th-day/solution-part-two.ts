const text = await Deno.readTextFile("./input.txt");

const processLine = (line: string): number => {
  const opening = ["(", "[", "{", "<"];
  const closing = [")", "]", "}", ">"];
  const findScoreForOpened: Record<string, number> = {
    "(": 1,
    "[": 2,
    "{": 3,
    "<": 4,
  };

  const stack = [];

  for (let i = 0; i < line.length; i++) {
    if (opening.includes(line[i])) {
      stack.push(line[i]);
      continue;
    }

    const indexClosed = closing.indexOf(line[i]);

    const previousOpened = stack.pop();

    if (!previousOpened) {
      return 0;
    }

    const indexOpened = opening.indexOf(previousOpened);

    if (indexOpened === indexClosed) {
      continue;
    }

    return 0;
  }

  if (stack.length) {
    let score = 0;

    for (let i = stack.length - 1; i >= 0; i--) {
      const closeCharScore = findScoreForOpened[stack[i]];

      score = score * 5 + closeCharScore;
    }

    return score;
  }

  return 0;
};

const lines = text.split("\n");

const scores = lines
  .map((line) => processLine(line))
  .filter((score) => score !== 0);

const middlePoint = Math.floor(scores.length / 2);

console.log("Answer:");
console.log(scores.sort((a, b) => b - a)[middlePoint]);
