const Robot = require('../robot');

describe("robot", function () {
    const instructionMock = 'RFRFRFRF';
    let iRobot;
    beforeEach(() => {
        iRobot = new Robot('1 1 E');
        iRobot.instruction(instructionMock);
    });

    it("should contain Robot data", () => {
        expect(iRobot.x).toEqual(1);
        expect(iRobot.y).toEqual(1);
        expect(iRobot.compassOrientation).toEqual('E');
    });

    it("should validation data", () => {
        spyOn(iRobot, 'validation');
        iRobot.validation();
        expect(iRobot.validation).toHaveBeenCalled();
    });

    it("should call instruction", () => {
        spyOn(iRobot, 'validationInstruction');
        iRobot.instruction(instructionMock);
        expect(iRobot.validationInstruction).toHaveBeenCalled();
        expect(iRobot.itemInstruction).toEqual(instructionMock);
    });

    it("should call toString", () => {
        spyOn(iRobot, 'toString');
        iRobot.instruction(instructionMock);
        const strValue = iRobot.toString();
        console.log('STRING:', strValue);
        expect(iRobot.toString).toHaveBeenCalled();
    });
});
