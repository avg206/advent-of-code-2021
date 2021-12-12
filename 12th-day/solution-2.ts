const text = await Deno.readTextFile("./input.txt");

const graph: Record<string, string[]> = {};

const Points = {
  Start: "start",
  End: "end",
} as const;

text.split("\n").forEach((line) => {
  const [a, b] = line.split("-");

  if (!graph[a]) {
    graph[a] = [];
  }
  if (!graph[b]) {
    graph[b] = [];
  }

  graph[a].push(b);
  graph[b].push(a);
});

type CaveLimits = Record<string, number>;

const createCavesLimits = (caves: string[]): CaveLimits => {
  return caves.reduce<CaveLimits>((acc, cave) => {
    if (cave === Points.Start) {
      acc[cave] = 1;
    } else if (/[a-z]+/g.test(cave)) {
      acc[cave] = 1;
    } else {
      acc[cave] = Number.MAX_SAFE_INTEGER;
    }

    return acc;
  }, {});
};

const caves = Object.keys(graph);

const DFS = (
  point: string,
  limits: CaveLimits,
  path: string[],
  canSkipSmallCave: boolean
): number => {
  if (point === Points.Start && limits[Points.Start] === 0) {
    return 0;
  }

  if (point === Points.End) {
    console.log(path.join(" "));
    return 1;
  }

  limits[point]--;

  let localResult = 0;

  if (limits[point] >= 0) {
    localResult = graph[point].reduce(
      (acc, newPoint) =>
        acc + DFS(newPoint, limits, [...path, newPoint], canSkipSmallCave),
      0
    );
  } else {
    if (canSkipSmallCave) {
      localResult = graph[point].reduce(
        (acc, newPoint) =>
          acc + DFS(newPoint, limits, [...path, newPoint], false),
        0
      );
    }
  }

  limits[point]++;

  return localResult;
};

console.log("Answer 1:");
console.log(DFS(Points.Start, createCavesLimits(caves), [Points.Start], false));

console.log("Answer 2:");
console.log(DFS(Points.Start, createCavesLimits(caves), [Points.Start], true));
