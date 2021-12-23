const NoneChar = ".";
const roomIndex = [2, 4, 6, 8];
const hallwaySpots = [0, 1, 3, 5, 7, 9, 10];
const charToRoomIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const charToEnergy: Record<string, number> = { A: 1, B: 10, C: 100, D: 1000 };

const generateKey = (hallway: string[], rooms: string[][]): string =>
  `${hallway.join("")}##${rooms.map((room) => room.join("")).join("#")}`;

const main = (rooms: string[][], description: string) => {
  const roomSize = rooms[0].length;
  const cache: Record<string, number> = {};

  const finishKey =
    `...........##` +
    [
      "A".repeat(roomSize),
      "B".repeat(roomSize),
      "C".repeat(roomSize),
      "D".repeat(roomSize),
    ].join("#");
  cache[finishKey] = 0;

  const simulate = (hallway: string[], rooms: string[][]): number => {
    const cacheKay = generateKey(hallway, rooms);

    if (cache[cacheKay] !== undefined) {
      return cache[cacheKay] || 0;
    }

    let minimumEnergy = Number.MAX_SAFE_INTEGER;

    // Move from hallway into room
    for (const spot of hallwaySpots) {
      if (hallway[spot] === NoneChar) continue;

      const char = hallway[spot];
      const targetRoom = charToRoomIndex[char];
      const targetRoomIndex = roomIndex[targetRoom];
      const room = rooms[targetRoom];

      let canEnterRoom = true;
      for (const roomChar of room) {
        if (roomChar !== NoneChar && roomChar !== char) canEnterRoom = false;
      }
      if (!canEnterRoom) continue;

      const diff = spot > targetRoomIndex ? -1 : 1;
      let isBlocked = false;
      for (let j = spot + diff; j !== targetRoomIndex; j += diff) {
        if (hallway[j] !== NoneChar) isBlocked = true;
      }
      if (isBlocked) continue;

      const charIndex = room.findLastIndex((char) => char === NoneChar);
      const steps = charIndex + 1;
      const totalSteps = steps + Math.abs(spot - targetRoomIndex);
      const moveCost = totalSteps * charToEnergy[char];

      const newRoom = room.map((roomChar, index) =>
        index === charIndex ? char : roomChar
      );
      // console.log("from hallway to room");
      const furtherCost = simulate(
        hallway.map((hallwayChar, index) =>
          index === spot ? NoneChar : hallwayChar
        ),
        rooms.map((room, index) => (index === targetRoom ? newRoom : room))
      );

      minimumEnergy = Math.min(minimumEnergy, moveCost + furtherCost);
    }

    // Move from room into hallway
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      let needToMove = false;
      for (const char of room) {
        if (charToRoomIndex[char] !== i && char !== NoneChar) needToMove = true;
      }
      if (!needToMove) continue;

      const charIndex = room.findIndex((char) => char !== NoneChar);
      const steps = charIndex + 1;
      const char = room[charIndex];

      for (const spot of hallwaySpots) {
        if (hallway[spot] !== NoneChar) continue;

        const totalSteps = steps + Math.abs(spot - roomIndex[i]);
        const moveCost = totalSteps * charToEnergy[char];

        const diff = spot > roomIndex[i] ? -1 : 1;
        let isBlocked = false;
        for (let j = spot + diff; j !== roomIndex[i]; j += diff) {
          if (hallway[j] !== NoneChar) isBlocked = true;
        }
        if (isBlocked) continue;

        const newRoom = room.map((roomChar, index) =>
          index === charIndex ? "." : roomChar
        );
        // console.log("from room to hallway", char, spot);
        const furtherCost = simulate(
          hallway.map((hallwayChar, index) =>
            index === spot ? char : hallwayChar
          ),
          rooms.map((room, index) => (index === i ? newRoom : room))
        );

        minimumEnergy = Math.min(minimumEnergy, moveCost + furtherCost);
      }
    }

    cache[cacheKay] = minimumEnergy;
    return minimumEnergy;
  };

  const energyCost = simulate(
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    rooms
  );
  console.log(`Energy cost for "${description}" is ${energyCost}`);
};

main(
  [
    ["D", "B"],
    ["A", "A"],
    ["B", "D"],
    ["C", "C"],
  ],
  "Part 1"
);

main(
  [
    ["B", "A"],
    ["C", "D"],
    ["B", "C"],
    ["D", "A"],
  ],
  "Part 1 sample"
);

main(
  [
    ["D", "D", "D", "B"],
    ["A", "C", "B", "A"],
    ["B", "B", "A", "D"],
    ["C", "A", "C", "C"],
  ],
  "Part 2"
);

main(
  [
    ["B", "D", "D", "A"],
    ["C", "C", "B", "D"],
    ["B", "B", "A", "C"],
    ["D", "A", "C", "A"],
  ],
  "Part 2 sample"
);
