const text = await Deno.readTextFile("./input.txt");

type SnailfishNumber = string[];

const prepareNumber = (number: string): SnailfishNumber => number.split("");

const renderNumber = (number: SnailfishNumber) => {
  console.log(number.join(""));
};

const additionTwoNumber = (
  leftNumber: SnailfishNumber,
  rightNumber: SnailfishNumber
): SnailfishNumber => {
  return ["[", ...leftNumber, ",", ...rightNumber, "]"];
};

const reduceNumber = (number: SnailfishNumber): SnailfishNumber => {
  const reducedNumber = [...number];

  while (true) {
    let isOperationPerformed = false;

    // exploit
    let brasketCount = 0;
    for (let i = 0; i < reducedNumber.length; i++) {
      if (reducedNumber[i] === "[") {
        brasketCount++;
      }

      if (reducedNumber[i] === "]") {
        brasketCount--;
      }

      if (brasketCount === 5) {
        let isPlainPair = true;
        let endIndex = i;

        for (let j = i + 1; j < reducedNumber.length; j++) {
          if (reducedNumber[j] === "[") {
            isPlainPair = false;
          }

          if (reducedNumber[j] === "]") {
            endIndex = j;
            break;
          }
        }

        if (!isPlainPair) {
          break;
        }

        const [leftDigit, rightDigit] = reducedNumber
          .slice(i + 1, endIndex)
          .join("")
          .split(",")
          .map((number) => parseInt(number, 10));

        // Incrementing to the right
        for (let j = endIndex + 1; j < reducedNumber.length; j++) {
          if (!["[", "]", ","].includes(reducedNumber[j])) {
            reducedNumber[j] = (
              parseInt(reducedNumber[j], 10) + rightDigit
            ).toString();
            break;
          }
        }

        // Incrementing to the left
        for (let j = i - 1; j >= 0; j--) {
          if (!["[", "]", ","].includes(reducedNumber[j])) {
            reducedNumber[j] = (
              parseInt(reducedNumber[j], 10) + leftDigit
            ).toString();
            break;
          }
        }

        reducedNumber.splice(i, endIndex - i + 1, "0");

        isOperationPerformed = true;
        break;
      }
    }

    if (isOperationPerformed) {
      continue;
    }

    // split
    for (let i = 0; i < reducedNumber.length; i++) {
      if (reducedNumber[i].length > 1) {
        const number = parseInt(reducedNumber[i], 10);

        reducedNumber.splice(
          i,
          1,
          "[",
          Math.floor(number / 2).toString(),
          ",",
          Math.ceil(number / 2).toString(),
          "]"
        );

        isOperationPerformed = true;
        break;
      }
    }

    if (!isOperationPerformed) {
      break;
    }
  }

  return reducedNumber;
};

const calculateMagnitude = (number: SnailfishNumber): number => {
  const calculate = (startIndex: number, endIndex: number): number => {
    let brasketCount = 0;

    if (startIndex === endIndex) {
      return parseInt(number[startIndex], 10);
    }

    for (let i = startIndex + 1; i < endIndex; i++) {
      if (number[i] === "[") {
        brasketCount++;
        continue;
      }

      if (number[i] === "]") {
        brasketCount--;
        continue;
      }

      if (number[i] === "," && brasketCount === 0) {
        return (
          3 * calculate(startIndex + 1, i - 1) +
          2 * calculate(i + 1, endIndex - 1)
        );
      }
    }

    return 0;
  };

  return calculate(0, number.length - 1);
};

const findAdditionOfNumber = (numbers: SnailfishNumber[]) => {
  let addition: SnailfishNumber = [];

  for (const number of numbers) {
    if (!addition.length) {
      addition = number;
      continue;
    }

    addition = additionTwoNumber(addition, number);
    addition = reduceNumber(addition);
  }

  console.log("Addition:");
  renderNumber(addition);
  console.log("Magnitude:");
  console.log(calculateMagnitude(addition));
};

const findMaxPossibleMagnitude = (number: SnailfishNumber[]) => {
  let maximumMagnitude = 0;

  for (let i = 0; i < number.length; i++) {
    for (let j = 0; j < number.length; j++) {
      if (i === j) {
        continue;
      }

      maximumMagnitude = Math.max(
        maximumMagnitude,
        calculateMagnitude(
          reduceNumber(additionTwoNumber(number[i], number[j]))
        )
      );
    }
  }

  console.log("Maximum magnitude:");
  console.log(maximumMagnitude);
};

const lines = text.trim().split("\n").map(prepareNumber);

findAdditionOfNumber(lines);
findMaxPossibleMagnitude(lines);
