const secondVariants = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];
const WinScore = 21;

const generateKey = (
  position1: number,
  position2: number,
  score1: number,
  score2: number
): string => `${position1}_${position2}_${score1}_${score2}`;

const map: Map<string, [number, number]> = new Map();
const simulate = (
  position1: number,
  position2: number,
  score1 = 0,
  score2 = 0
): [number, number] => {
  const key = generateKey(position1, position2, score1, score2);
  if (map.has(key)) {
    return map.get(key) || [0, 0];
  }

  if (score2 >= WinScore) return [0, 1];

  let winCount1 = 0;
  let winCount2 = 0;

  for (const [addedScore, times] of secondVariants) {
    const newPosition = (position1 + addedScore) % 10 || 10;
    const [win1, win2] = simulate(position2, newPosition, score2, score1 + newPosition);
    winCount1 += win2 * times;
    winCount2 += win1 * times;
  }

  map.set(generateKey(position1, position2, score1, score2), [winCount1, winCount2]);

  return [winCount1, winCount2];
};

const result = simulate(3, 5);

console.log(Math.max(...result));
