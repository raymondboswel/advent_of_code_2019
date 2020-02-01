import { input } from "./puzzle_input";
import { executeIntcode } from "./2_1";

interface Permutation {
  noun: number;
  verb: number;
}

function reverseIntCode(intCode: number[], knownOutput: number): Permutation {
  function nounVerbPermutations(
    nounRange: number[],
    verbRange: number[]
  ): Permutation[] {
    const permutations = [];
    nounRange.forEach(noun => {
      verbRange.forEach(verb => {
        permutations.push({ noun: noun, verb: verb });
      });
    });
    return permutations;
  }

  const nounRange = Array.from(Array(100).keys());
  const verbRange = Array.from(Array(100).keys());
  const permutations: Permutation[] = nounVerbPermutations(
    nounRange,
    verbRange
  );

  function reverseIntCodeIter(
    intCode: number[],
    nvPermutations: Permutation[]
  ) {
    const permutation = nvPermutations[0];
    const testCode = [...intCode];
    testCode[1] = permutation.noun;
    testCode[2] = permutation.verb;
    let res = executeIntcode(testCode, 0);
    if (res[0] === knownOutput) {
      return { noun: res[1], verb: res[2] };
    } else {
      return reverseIntCodeIter(intCode, nvPermutations.slice(1));
    }
  }

  return reverseIntCodeIter(intCode, permutations);
}

const finishedCode = [...input];
const output = 19690720;

const res = reverseIntCode(finishedCode, output);
console.log(100 * res.noun + res.verb);
