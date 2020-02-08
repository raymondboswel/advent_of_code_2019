import { wire1, wire2 } from "./example_input";

interface Coordinate {
  x: number;
  y: number;
  wire?: string;
}

interface Segment {
  start: Coordinate;
  end: Coordinate;
  orientation?: Orientation;
}

interface PerpendicularSegments {
  vertical?: Segment;
  horizontal?: Segment;
}

interface XBounds {
  min: number;
  max: number;
}

interface YBounds {
  min: number;
  max: number;
}

type Orientation = "vertical" | "horizontal";

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
    (segments, coord, _idx, _arr) => {
      const lastSegmentEnd: Coordinate = segments[segments.length - 1].end;
      const newSegment: Segment = { start: lastSegmentEnd, end: coord };
      return [...segments, newSegment];
    },
    [{ start: coords[0], end: coords[1] }]
  );
}

function findGradient(segment: Segment) {
  return (segment.start.y - segment.end.y) / (segment.start.x - segment.end.x);
}

function findOffset(segment: Segment, gradient: number) {
  return segment.start.y - gradient * segment.start.x;
}

function findOrientation(segment: Segment): Orientation {
  return segment.start.x === segment.end.x ? "vertical" : "horizontal";
}

const coords1 = generateWireCoords(wire1).map(c => {
  return { ...c, wire: "wire1" };
});
const coords2 = generateWireCoords(wire2).map(c => {
  return { ...c, wire: "wire2" };
});

const coords = coords1.concat(coords2);

const segments1 = generateWireSegments(coords1);
const segments2 = generateWireSegments(coords2);

const intersections: Coordinate[] = [];

function findXBounds(hSegment: Segment): XBounds {
  return {
    min: Math.min(hSegment.start.x, hSegment.end.x),
    max: Math.max(hSegment.start.x, hSegment.end.x)
  };
}

function findYBounds(vSegment: Segment): YBounds {
  return {
    min: Math.min(vSegment.start.y, vSegment.end.y),
    max: Math.max(vSegment.start.y, vSegment.end.y)
  };
}

function vXInsideHx(vSegment: Segment, hSegment: Segment) {
  const xMin = Math.min(hSegment.end.x, hSegment.start.x);
  const xMax = Math.max(hSegment.end.x, hSegment.start.x);
  return xMin <= vSegment.start.x && xMax >= vSegment.start.x;
}

function hYInsideVy(vSegment: Segment, hSegment: Segment) {
  const yMin = Math.min(vSegment.end.y, vSegment.start.y);
  const yMax = Math.max(vSegment.end.y, vSegment.start.y);
  return yMin <= hSegment.start.y && yMax >= vSegment.start.x;
}

function intersection(vSegment: Segment, hSegment: Segment): Coordinate {
  return { x: vSegment.start.x, y: hSegment.start.y };
}

/////////////////////////////
// console.log(segments1); //
// console.log(segments2); //
/////////////////////////////

segments1.forEach(s1 => {
  s1 = { ...s1, orientation: findOrientation(s1) };

  segments2.forEach(s2 => {
    s2 = { ...s2, orientation: findOrientation(s2) };

    if (s1.orientation != s2.orientation) {
      const perpSegments: PerpendicularSegments = {};
      perpSegments[s1.orientation] = s1;
      perpSegments[s2.orientation] = s2;
      console.log("========================");
      console.log("perpSegments", perpSegments);
      const xBounds = findXBounds(perpSegments.horizontal);
      const yBounds = findYBounds(perpSegments.vertical);
      console.log("xBounds", xBounds);
      console.log("YBounds", yBounds);
      console.log("vX", perpSegments.vertical.end.x);
      console.log("hY", perpSegments.horizontal.end.y);
      console.log(
        "Intersects",
        vXInsideHx(perpSegments["vertical"], perpSegments["horizontal"]) &&
          hYInsideVy(perpSegments["vertical"], perpSegments["horizontal"])
      );
      if (
        vXInsideHx(perpSegments["vertical"], perpSegments["horizontal"]) &&
        hYInsideVy(perpSegments["vertical"], perpSegments["horizontal"])
      ) {
        intersections.push(
          intersection(perpSegments["vertical"], perpSegments["horizontal"])
        );
      }
    }
  });
});

function manhattanDistance(coord: Coordinate): number {
  return Math.abs(coord.x) + Math.abs(coord.y);
}

let res = intersections
  .map(i => {
    return { coord: i, dist: manhattanDistance(i) };
  })
  .filter(r => r.dist !== 0)
  .sort((a, b) => a.dist - b.dist);

console.log(res);
