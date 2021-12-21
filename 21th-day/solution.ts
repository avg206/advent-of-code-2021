const text = await Deno.readTextFile("./input.txt");

const players = text
  .trim()
  .split("\n")
  .map((line) => {
    const [_, position] = line.split(": ");

    return parseInt(position, 10);
  });

const scores = new Array(players.length).fill(0);
let rotator = 1;
let playerIndex = 0;
let rollsCount = 0;

while (true) {
  const rolls = rotator * 3 + 3;
  rotator += 3;
  rollsCount += 3;

  if (rotator > 100) {
    rotator = rotator % 100;
  }

  players[playerIndex] = (players[playerIndex] + rolls) % 10;
  if (players[playerIndex] === 0) {
    players[playerIndex] = 10;
  }

  scores[playerIndex] += players[playerIndex];

  console.log(rotator, playerIndex, scores);

  if (scores[playerIndex] >= 1000) {
    break;
  }

  playerIndex = playerIndex === 0 ? 1 : 0;
}

console.log("Rolls count:");
console.log(rollsCount);

console.log("Result:");
console.log(rollsCount * Math.min(...scores));
