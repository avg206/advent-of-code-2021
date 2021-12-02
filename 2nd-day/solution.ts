const text = await Deno.readTextFile("./input.txt");

const Movements = {
  Forward: 'forward',
  Up: 'up',
  Down: 'down'
} as const;


let depth = 0;
let longitude = 0;

text
  .split('\n')
  .forEach((string) =>  {
    const parts = string.split(' ');
    const move = parts[0];
    const diff = parseInt(parts[1], 10)

    switch(move) {
      case Movements.Up:
        depth = depth - diff;
        break;

      case Movements.Down:
        depth = depth + diff;
        break;

      case Movements.Forward:
        longitude = longitude + diff;
        break;
    }
  })

console.log(depth * longitude);