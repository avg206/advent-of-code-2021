const text = await Deno.readTextFile("./input.txt");

type Point = [number, number, number];
type Scanner = Point[];

function* generateRotator() {
  yield ([a, b, c]: Point): Point => [a, b, c];
  yield ([a, b, c]: Point): Point => [b, c, a];
  yield ([a, b, c]: Point): Point => [c, a, b];
  yield ([a, b, c]: Point): Point => [c, b, -a];
  yield ([a, b, c]: Point): Point => [b, a, -c];
  yield ([a, b, c]: Point): Point => [a, c, -b];

  yield ([a, b, c]: Point): Point => [a, -b, -c];
  yield ([a, b, c]: Point): Point => [b, -c, -a];
  yield ([a, b, c]: Point): Point => [c, -a, -b];
  yield ([a, b, c]: Point): Point => [c, -b, a];
  yield ([a, b, c]: Point): Point => [b, -a, c];
  yield ([a, b, c]: Point): Point => [a, -c, b];

  yield ([a, b, c]: Point): Point => [-a, b, -c];
  yield ([a, b, c]: Point): Point => [-b, c, -a];
  yield ([a, b, c]: Point): Point => [-c, a, -b];
  yield ([a, b, c]: Point): Point => [-c, b, a];
  yield ([a, b, c]: Point): Point => [-b, a, c];
  yield ([a, b, c]: Point): Point => [-a, c, b];

  yield ([a, b, c]: Point): Point => [-a, -b, c];
  yield ([a, b, c]: Point): Point => [-b, -c, a];
  yield ([a, b, c]: Point): Point => [-c, -a, b];
  yield ([a, b, c]: Point): Point => [-c, -b, -a];
  yield ([a, b, c]: Point): Point => [-b, -a, -c];
  yield ([a, b, c]: Point): Point => [-a, -c, -b];
}

const calculateDistance = (point1: Point, point2: Point): number =>
  Math.abs(point1[0] - point2[0]) +
  Math.abs(point1[1] - point2[1]) +
  Math.abs(point1[2] - point2[2]);

const findDeltaBetweenScanners = (
  scannerA: Scanner,
  scannerB: Scanner
): Point | undefined => {
  const set = new Set(scannerA.map((point) => point.join(",")));

  for (let i = 0; i < scannerA.length; i++) {
    for (let j = 0; j < scannerB.length; j++) {
      let common = 0;
      const delta = [
        scannerA[i][0] - scannerB[j][0],
        scannerA[i][1] - scannerB[j][1],
        scannerA[i][2] - scannerB[j][2],
      ] as Point;

      for (let g = 0; g < scannerB.length; g++) {
        if (
          set.has(scannerB[g].map((p, index) => p + delta[index]).join(","))
        ) {
          common++;
        }
      }

      if (common >= 12) {
        return delta;
      }
    }
  }

  return undefined;
};

const mergeTwoScanners = (
  scannerA: Scanner,
  scannerB: Scanner
): [Scanner, Point] | undefined => {
  const iterator = generateRotator();

  for (const rotator of iterator) {
    let rotatedB = scannerB.map(rotator);

    const delta = findDeltaBetweenScanners(scannerA, rotatedB);

    if (delta !== undefined) {
      rotatedB = rotatedB.map(([a, b, c]) => [
        a + delta[0],
        b + delta[1],
        c + delta[2],
      ]);

      const set: Set<string> = new Set([
        ...scannerA.map((point) => point.join(",")),
        ...rotatedB.map((point) => point.join(",")),
      ]);

      return [
        Array.from(set.keys()).map(
          (key) => key.split(",").map((number) => parseInt(number, 10)) as Point
        ),
        delta,
      ];
    }
  }

  return undefined;
};

const mergeAllScanners = (scanners: Scanner[]): [Scanner, Point[]] => {
  let current = scanners[0];
  const leftScanners = scanners.slice(1);
  const deltas: Point[] = [];

  while (leftScanners.length > 0) {
    let mergeFound = false;

    for (let i = 0; i < leftScanners.length; i++) {
      const merge = mergeTwoScanners(current, leftScanners[i]);

      if (merge !== undefined) {
        current = merge[0];
        deltas.push(merge[1]);
        mergeFound = true;
        leftScanners.splice(i, 1);
        console.log(
          "Merge found, amount of points:",
          current.length,
          "left scanners:",
          leftScanners.length
        );
        break;
      }
    }

    if (!mergeFound) {
      throw new Error("No merge found");
    }
  }

  return [current, deltas];
};

const scanners: Scanner[] = [];

const lines = text.trim().split("\n\n");

lines.forEach((input) => {
  scanners.push(
    input.split("\n").reduce<Point[]>((acc, line) => {
      if (line.substr(0, 3) === "---") {
        return acc;
      }

      const [x, y, z] = line.split(",").map((number) => parseInt(number, 10));
      acc.push([x, y, z]);

      return acc;
    }, [])
  );
});

const [points, deltas] = mergeAllScanners(scanners);

let maxDistance = 0;
for (const point1 of deltas) {
  for (const point2 of deltas) {
    maxDistance = Math.max(maxDistance, calculateDistance(point1, point2));
  }
}

console.log("Amount of points:");
console.log(points.length);

console.log("Max Manhattan distance:");
console.log(maxDistance);
