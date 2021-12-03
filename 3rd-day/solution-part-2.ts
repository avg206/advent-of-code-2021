const text = await Deno.readTextFile("./input.txt");

// boolean - should we take one
type Comparator = (oneCount: number, zeroCount: number) => boolean;

const numbers = text
  .split("\n");

const numberLength = numbers[0].length;

const foo = (
  digitPart: string,
  numbers: string[],
  currentIndex: number,
  comparator: Comparator,
): string => {
  const newNumbers = numbers.filter((string) =>
    string.indexOf(digitPart) === 0
  );

  if (newNumbers.length === 1) {
    return newNumbers[0];
  }

  if (currentIndex === numberLength) {
    throw new Error("Single string is not found");
  }

  let oneCount = 0;
  let zeroCount = 0;

  for (const number of newNumbers) {
    if (number[currentIndex] === "1") {
      oneCount++;
    } else {
      zeroCount++;
    }
  }

  if (comparator(oneCount, zeroCount)) {
    return foo(digitPart + "1", newNumbers, currentIndex + 1, comparator);
  }

  return foo(digitPart + "0", newNumbers, currentIndex + 1, comparator);
};

const oxygenGeneratorRating = foo("", numbers, 0, (a, b) => a >= b);
const CO2ScrubberRating = foo("", numbers, 0, (a, b) => b > a);

const oxygenGeneratorRatingNumber = parseInt(oxygenGeneratorRating, 2);
const CO2ScrubberRatingNumber = parseInt(CO2ScrubberRating, 2);

console.log(oxygenGeneratorRatingNumber * CO2ScrubberRatingNumber);
