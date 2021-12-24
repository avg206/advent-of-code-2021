const text = await Deno.readTextFile("./input.txt");
const lines = text.trim().split("\n");

const StepLimit = 14;

const divZ: number[] = [];
const addX: number[] = [];
const addY: number[] = [];

const generateThresholds = () => {
  const result = new Array(StepLimit).fill(1);
  let value = 1;

  for (let i = StepLimit - 1; i >= 0; i--) {
    value = value * divZ[i];
    result[i] = value;
  }

  return result;
};

for (const [index, line] of lines.entries()) {
  if (line.includes("add x ") && line !== "add x z") {
    addX.push(parseInt(line.split(" ")[2], 10));
  }
  if (line.includes("div z ")) {
    divZ.push(parseInt(line.split(" ")[2], 10));
  }
  if (line.includes("add y ") && (index + 1) % 18 === 16) {
    addY.push(parseInt(line.split(" ")[2], 10));
  }
}

const calculateZ = (step: number, currentZ: number, w: number): number => {
  let z = currentZ;

  // mul x 0
  let x = 0;
  // add x z
  x = x + z;
  // mod x 26
  x = x % 26;
  // div z {a}
  z = Math.floor(currentZ / divZ[step]);
  // add x {b}
  x = x + addX[step];
  // eql x w
  x = x === w ? 1 : 0;
  // eql x 0
  x = x === 0 ? 1 : 0;
  // mul y 0
  let y = 0;
  // add y 25
  y = y + 25;
  // mul y x
  y = y * x;
  // add y 1
  y = y + 1;
  // mul z y
  z = z * y;
  // mul y 0
  y = 0;
  // add y w
  y = y + w;
  // add y {c}
  y = y + addY[step];
  // mul y x
  y = y * x;
  // add z y
  z = z + y;

  return z;
};

const solve = (range: number[]) => {
  const zThreshold = generateThresholds();
  const cache: Record<string, string | null> = {};

  const search = (step: number, currentZ: number): string | null => {
    const cacheKey = `${step}_${currentZ}`;

    if (step === StepLimit) {
      if (currentZ === 0) {
        return "";
      }

      return null;
    }

    if (cache[cacheKey] !== undefined) {
      return cache[cacheKey];
    }

    if (currentZ > zThreshold[step]) {
      cache[cacheKey] = null;
      return null;
    }

    cache[cacheKey] = null;
    for (const w of range) {
      const z = calculateZ(step, currentZ, w);

      const restOfString = search(step + 1, z);

      if (restOfString === null) {
        continue;
      }

      cache[cacheKey] = `${w}${restOfString}`;
      return cache[cacheKey];
    }

    return cache[cacheKey];
  };

  const result = search(0, 0);

  console.log("Solution for range", range.join(" "), " - ", result);
};

solve([9, 8, 7, 6, 5, 4, 3, 2, 1]);
solve([1, 2, 3, 4, 5, 6, 7, 8, 9]);
