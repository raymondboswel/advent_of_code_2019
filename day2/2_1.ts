
const one = (a, b) => a + b;
const two = (a, b) => a * b;
declare var require: any
const fs = require('fs');

function executeIntcode(intCode: number[], currentStep: number) {


    const opCode = intCode[currentStep * 4];
    const operandLocationA = intCode[currentStep * 4 + 1];
    const operandLocationB = intCode[currentStep * 4 + 2];
    const outputLocation = intCode[currentStep * 4 + 3];

    let op;
    switch (opCode) {
        case 1: 
            op = one;
            break;
        case 2: 
            op = two;
            break;
        case 99:
            return intCode;
        default: 
            throw new Error("invalid opcode")
    }

    const res = intCode.slice();

    res[outputLocation] = op(intCode[operandLocationA], intCode[operandLocationB]);

    return executeIntcode(res, currentStep + 1);
}


const result =
    executeIntcode([1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,10,19,23,1,6,23,27,1,5,27,31,1,10,31,35,2,10,35,39,1,39,5,43,2,43,6,47,2,9,47,51,1,51,5,55,1,5,55,59,2,10,59,63,1,5,63,67,1,67,10,71,2,6,71,75,2,6,75,79,1,5,79,83,2,6,83,87,2,13,87,91,1,91,6,95,2,13,95,99,1,99,5,103,2,103,10,107,1,9,107,111,1,111,6,115,1,115,2,119,1,119,10,0,99,2,14,0,0],
                   0);
fs.writeFile("./output", result, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 


