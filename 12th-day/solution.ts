const text = await Deno.readTextFile("./input.txt");

const graph: Record<string, string[]> = {};

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

console.log("Graph:");
console.log(graph);

let result = 0;
const paths: string[] = [];
const pathMap: Record<string, boolean> = {};

const DFS = (
  currentPoint: string,
  visitedMap: Record<string, number>,
  path: string[],
  visitTwice: boolean
) => {
  if (currentPoint === "end") {
    const resultPath = path.join(" ");

    if (!pathMap[resultPath]) {
      result++;
      pathMap[resultPath] = true;
      paths.push(resultPath);
    }

    return;
  }

  if (visitedMap[currentPoint]) {
    return;
  }

  // Small cave
  if (currentPoint.toLocaleLowerCase() === currentPoint) {
    if (currentPoint === "start") {
      visitedMap[currentPoint] = 1;

      graph[currentPoint].forEach((point) => {
        DFS(point, visitedMap, [...path, point], visitTwice);
      });

      return;
    }

    graph[currentPoint].forEach((point) => {
      if (point === "end") {
        DFS(point, visitedMap, [...path, point], false);
        return;
      }

      if (visitTwice) {
        DFS(point, visitedMap, [...path, point], false);
      }

      visitedMap[currentPoint] = 1;

      DFS(point, visitedMap, [...path, point], visitTwice);
      visitedMap[currentPoint] = 0;
    });

    return;
  }

  graph[currentPoint].forEach((point) => {
    DFS(point, visitedMap, [...path, point], visitTwice);
  });
};

DFS("start", {}, ["start"], true);

console.log("Answer:");
console.log(result);
