// target area: x=20..30, y=-10..-5
// target area: x=209..238, y=-86..-59

const xLimits = [209, 238];
const yLimits = [-86, -59];

const simulate = (velocity: [number, number]): boolean => {
  let [aX, aY] = velocity;
  let x = 0;
  let y = 0;

  while (true) {
    if (
      x >= xLimits[0] &&
      x <= xLimits[1] &&
      y >= yLimits[0] &&
      y <= yLimits[1]
    ) {
      return true;
    }

    if (x > xLimits[1] || y < yLimits[0]) {
      return false;
    }

    x += aX;
    y += aY;

    if (aX < 0) {
      aX += 1;
    } else if (aX > 0) {
      aX -= 1;
    }

    aY -= 1;
  }
};

let count = 0;
let maxY = Math.min(...yLimits);

for (let x = 1; x <= xLimits[1]; x++) {
  for (let y = Math.min(...yLimits); y <= Math.abs(Math.min(...yLimits)); y++) {
    if (simulate([x, y])) {
      maxY = Math.max(maxY, y);
      count++;
    }
  }
}

console.log("max y velocity", maxY, "max y position", ((1 + maxY) * maxY) / 2);
console.log("amount of velocities", count);
