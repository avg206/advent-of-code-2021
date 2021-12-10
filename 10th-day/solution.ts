const text = await Deno.readTextFile("./input.txt");

const opening = ["(", "[", "{", "<"];
const closing = [")", "]", "}", ">"];
const scores = [3, 57, 1197, 25137];

const processLine = (line: string): number => {
  const stack = [];

  for (let i = 0; i < line.length; i++) {
    if (opening.includes(line[i])) {
      stack.push(line[i]);
      continue;
    }

    const indexClosed = closing.indexOf(line[i]);

    const previousOpened = stack.pop();

    if (!previousOpened) {
      return scores[indexClosed];
    }

    const indexOpened = opening.indexOf(previousOpened);

    if (indexOpened === indexClosed) {
      continue;
    }

    return scores[indexClosed];
  }

  return 0;
};

const lines = text.split("\n");

const answer = lines.reduce((prev, line) => prev + processLine(line), 0);

console.log("Answer:");
console.log(answer);
