import { wire1, wire2 } from "./day3_input";

interface Coordinate {
  x: number;
  y: number;
  wire?: string;
}

interface Segment {
  start: Coordinate;
  end: Coordinate;
}

function generateWireCoords(wireDeltas: string[]) {
  function nextCoordFn(
    direction: string
  ): (c: Coordinate, a: number) => Coordinate {
    switch (direction) {
      case "R":
        return (coord: Coordinate, amount: number) => {
          return { ...coord, x: coord.x + amount };
        };
      case "L":
        return (coord: Coordinate, amount: number) => {
          return { ...coord, x: coord.x - amount };
        };
      case "U":
        return (coord: Coordinate, amount: number) => {
          return { ...coord, y: coord.y + amount };
        };
      case "D":
        return (coord: Coordinate, amount: number) => {
          return { ...coord, y: coord.y - amount };
        };
    }
  }
  function nextCoord(curCoord: Coordinate, delta: string): Coordinate {
    const direction = delta.slice(0, 1);
    const amount = delta.slice(1);
    const nextFn = nextCoordFn(direction);
    return nextFn(curCoord, parseInt(amount));
  }

  return wireDeltas.reduce<Coordinate[]>(
    (acc, wireDelta, idx, arr) => {
      const next = nextCoord(acc[acc.length - 1], wireDelta);
      return [...acc, next];
    },
    [{ x: 0, y: 0 }]
  );
}

function generateWireSegments(coords: Coordinate[]): Segment[] {
  return coords.slice(2).reduce<Segment[]>(
    (segments, coord, idx, arr) => {
      const lastSegmentEnd: Coordinate = segments[segments.length - 1].end;
      const newSegment: Segment = { start: lastSegmentEnd, end: coord };
      return [...segments, newSegment];
    },
    [{ start: coords[0], end: coords[1] }]
  );
}

const coords1 = generateWireCoords(wire1).map(c => {
  return { ...c, wire: "wire1" };
});
const coords2 = generateWireCoords(wire2).map(c => {
  return { ...c, wire: "wire2" };
});

console.log(coords1);
console.log(coords2);

const coords = coords1.concat(coords2);

const wireCrossings = coords.filter(c1 =>
  coords.some(c2 => c2.wire !== c1.wire && c1.x === c2.x && c1.y === c2.y)
);

console.log(wireCrossings);
