const text = await Deno.readTextFile("./input.txt");

const setBit = (number: number, index: number) => number | (1 << index);

const checkBit = (number: number, index: number) =>
  (number & (1 << index)) !== 0;

/**
 * Create abstract board
 *
 * @param strings
 */
const createBoard = (strings: string[]) => {
  const FULL_LINE_NUMBER = 0b11111;

  const array = strings
    .map((string) => string.trim())
    .map((string) => string.replaceAll(/ +/gi, " "))
    .map((string) => string.split(" "))
    .map((line) => line.map((string) => parseInt(string, 10)));

  const map: Record<number, [number, number]> = {};
  array.forEach((line, i) => {
    line.forEach((number, j) => {
      map[number] = [i, j];
    });
  });
  const checks = [0, 0, 0, 0, 0];

  // Methods
  const isWin = () => {
    // Horizontal
    if (checks.find((line) => line === FULL_LINE_NUMBER)) {
      return true;
    }

    // Vertical
    if (checks.reduce((prev, curr) => prev & curr, FULL_LINE_NUMBER) !== 0) {
      return true;
    }

    return false;
  };
  const addNumber = (number: number) => {
    const position = map[number];

    if (!position) {
      return;
    }

    const [i, j] = position;

    checks[i] = setBit(checks[i], j);
  };
  const calculateScore = (winningNumber: number) => {
    let sum = 0;

    array.forEach((line, i) => {
      line.forEach((number, j) => {
        if (!checkBit(checks[i], j)) {
          sum += number;
        }
      });
    });

    return sum * winningNumber;
  };
  const renderSnapshot = () => {
    for (let i = 0; i < 5; i++) {
      const line = [];
      for (let j = 0; j < 5; j++) {
        line.push(checkBit(checks[i], j) ? 1 : 0);
      }
      console.log(line.join(" "));
    }
  };

  return {
    isWin,
    addNumber,
    calculateScore,
    renderSnapshot,
  };
};

type BoardInterface = ReturnType<typeof createBoard>;

const lines = text.split("\n");
const numbers = lines[0].split(",").map((string) => parseInt(string, 10));

// Create boards
const boards: BoardInterface[] = [];
let index = 2;
while (index < lines.length - 1) {
  const newBoard = lines.slice(index, index + 5);

  boards.push(createBoard(newBoard));

  index += 6;
}

const winners = new Array(boards.length).fill(0);

// Apply numbers
for (let i = 0; i < numbers.length; i++) {
  boards.forEach((board) => board.addNumber(numbers[i]));

  for (let j = 0; j < boards.length; j++) {
    if (winners[j] === 1) {
      continue;
    }

    if (boards[j].isWin()) {
      winners[j] = 1;

      console.log("Step:");
      console.log(i + 1);
      console.log("Winner board:");
      console.log(j + 1);
      console.log("Winning number:");
      console.log(numbers[i]);
      console.log("Score:");
      console.log(boards[j].calculateScore(numbers[i]));
      // console.log("Snapshot:");
      // boards[j].renderSnapshot();
      console.log("---------------");
    }
  }
}
