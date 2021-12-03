const text = await Deno.readTextFile("./input.txt");

const numbers = text
  .split("\n").map((string) => string.split(""));

const numberLength = numbers[0].length;

let gamma = "";
let epsilon = "";

const oneCount = new Array(numberLength).fill(0);
const zeroCount = new Array(numberLength).fill(0);

for (const number of numbers) {
  number.forEach((digit, index) => {
    if (digit === "1") {
      oneCount[index] += 1;
    } else {
      zeroCount[index] += 1;
    }
  });
}

for (let i = 0; i < numberLength; i++) {
  if (oneCount[i] > zeroCount[i]) {
    gamma += "1";
    epsilon += "0";
  } else {
    gamma += "0";
    epsilon += "1";
  }
}

const gammaNumber = parseInt(gamma, 2);
const epsilonNumber = parseInt(epsilon, 2);

console.log(gammaNumber, epsilonNumber);
