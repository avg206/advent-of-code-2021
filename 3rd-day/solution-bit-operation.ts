const text = await Deno.readTextFile("./input.txt");

const dec2bin = (number: number) => number.toString(2);

const numbers = text.split("\n").map((string) => parseInt(string, 2));

const numbersAmount = numbers.length;
const numberLength = Math.ceil(Math.log2(Math.max.apply(null, numbers)));

const setBit = (number: number, index: number) => number | (1 << index);

const checkBit = (number: number, index: number) =>
  (number & (1 << index)) !== 0;

const counts = new Array(numberLength).fill(0);

for (const number of numbers) {
  let index = 0;

  while (index < numberLength) {
    counts[index] += checkBit(number, index);
    index++;
  }
}

let gammaNumber = 0;
let epsilonNumber = 0;

for (let index = 0; index < numberLength; index++) {
  if (counts[index] > numbersAmount / 2) {
    gammaNumber = setBit(gammaNumber, index);
  } else {
    epsilonNumber = setBit(epsilonNumber, index);
  }
}

/**
 * Binary:
 * 110010111011
 * 1101000100
 * Answer:
 * 2724524
 */

console.log("Binary:");
console.log(dec2bin(gammaNumber));
console.log(dec2bin(epsilonNumber));
console.log("Answer:");
console.log(gammaNumber * epsilonNumber);
