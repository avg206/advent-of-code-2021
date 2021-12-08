const text = await Deno.readTextFile("./input.txt");

const findDiff = (dig1: string, dig2: string): string => {
  const a = dig1.split("");
  const b = dig2.split("");

  const result: string[] = [];

  a.forEach((connection) => {
    if (!b.includes(connection)) {
      result.push(connection);
    }
  });

  return result.join("");
};

const findStringsByLength = (digs: string[], length: number): string[] => {
  const strings: string[] = digs.filter((dig) => dig.length === length);
  if (!strings.length) {
    throw new Error(`String with length ${length} not found`);
  }

  return strings;
};

/**
 * 1. Find two dig and find map for C and F, it's 1
 * 2. Find 3 dig and find map for A, it's 7
 * 3. Find 7 dig, it's 8
 * 4. Find 6 dig, find one do not contain C,F, it's 6
 * 5. Find 5 dig, find one one contain both C,F, it's 3
 * 6. Find 5 dig, find one with only one diff with 6, it's 5
 * 7. Find 6 dig, find diff with 8 for both, check if 5 contain diff, if yes, it's 0, if no, it's 9
 */

interface NumberProcessor {
  number: number;
  solver: () => string | undefined;
}

const processLine = (line: string): number => {
  const stringToNumber: Record<string, number> = {};
  const numberToString: Record<number, string> = {};

  const assignStringToNumber = (
    string: string | undefined,
    number: number
  ): void => {
    if (!string) {
      throw new Error(`String for ${number} not found`);
    }

    stringToNumber[string] = number;
    numberToString[number] = string;
  };

  const input = line.split(" | ");
  const digits: string[] = input[0]
    .split(" ")
    .map((dig) => dig.split("").sort().join(""))
    .sort();

  const solvers: NumberProcessor[] = [
    {
      number: 1,
      solver: () => findStringsByLength(digits, 2)[0],
    },
    {
      number: 7,
      solver: () => findStringsByLength(digits, 3)[0],
    },
    {
      number: 8,
      solver: () => findStringsByLength(digits, 7)[0],
    },
    {
      number: 6,
      solver: () =>
        findStringsByLength(digits, 6).find(
          (string) => findDiff(string, numberToString[1]).length === 5
        ),
    },
    {
      number: 3,
      solver: () =>
        findStringsByLength(digits, 5).find(
          (string) => findDiff(string, numberToString[1]).length === 3
        ),
    },
    {
      number: 5,
      solver: () =>
        findStringsByLength(digits, 5).find(
          (string) => findDiff(numberToString[6], string).length === 1
        ),
    },
    {
      number: 9,
      solver: () =>
        findStringsByLength(digits, 6)
          .filter((string) => stringToNumber[string] === undefined)
          .find((string) => {
            const diff = findDiff(numberToString[8], string);
            const newDiff = findDiff(numberToString[5], diff);

            return newDiff.length === numberToString[5].length;
          }),
    },
    {
      number: 0,
      solver: () =>
        findStringsByLength(digits, 6).find(
          (string) => !stringToNumber[string]
        ),
    },
    {
      number: 4,
      solver: () =>
        findStringsByLength(digits, 4).find(
          (string) => !stringToNumber[string]
        ),
    },
    {
      number: 2,
      solver: () =>
        digits.find((string) => stringToNumber[string] === undefined),
    },
  ];

  solvers.forEach(({ number, solver }) => {
    const string = solver();

    assignStringToNumber(string, number);
  });

  const resultNumber = input[1]
    .split(" ")
    .map((dig) => dig.split("").sort().join(""))
    .map((string) => stringToNumber[string])
    .join("");

  return parseInt(resultNumber, 10);
};

const lines = text.trim().split("\n");

const answer = lines.reduce((acc, line) => acc + processLine(line), 0);

console.log("Answer:");
console.log(answer);
