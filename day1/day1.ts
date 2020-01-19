import { weights } from "./module-weights";

function fuelRequired(moduleMass: number) {
  return Math.floor(moduleMass / 3) - 2;
}

function fuelOfFuel(fuelWeight: number) {
  const fof = fuelRequired(fuelWeight);
  if (fof <= 0) {
    return 0;
  } else {
    return fof + fuelOfFuel(fof);
  }
}

function totalFuelRequired() {
  return weights.reduce((a, b) => {
    return a + fuelRequired(b) + fuelOfFuel(fuelRequired(b));
  }, 0);
}

console.log(totalFuelRequired());
