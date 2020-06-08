/**
 *  author: Mark Webley
 *  date:   8/06/2020
 */

// 1 1 E
function Robot(defaultCoordinator) {
    this.validation(defaultCoordinator);
    let robotDefaults = defaultCoordinator.split(' ');
    this.x = Number(robotDefaults[0]);
    this.y = Number(robotDefaults[1]);
    this.compassOrientation = robotDefaults[2];
    this.lost = '';
    this.itemInstruction = '';
}

Robot.prototype.validation = function (defaultCoordinator) {
    let robotDefaults = defaultCoordinator.split(' ');
    if (robotDefaults.length < 3) {
        throw new Error('missing x y compassDirection');
    }
    if (isNaN(Number(robotDefaults[0])) || isNaN(Number(robotDefaults[1])) ||
        isNaN(Number(robotDefaults[0])) > 50 || isNaN(Number(robotDefaults[1])) > 50
    ) {
        throw new Error('set x and y coordinates for Robot, max coordinates allowed 50')
    }
    if (Object.values(Compass).indexOf(robotDefaults[2]) === -1) {
        throw new Error(`define compass direction ${Object.keys(Compass)} for Robot`);
    }
}

Robot.prototype.instruction = function (instruction) {
    this.validationInstruction(instruction);
    this.itemInstruction = instruction;
}

Robot.prototype.validationInstruction = function (instruction) {
    if (typeof instruction === 'undefined') {
        throw new Error('set instruction for robot')
    }
    if (instruction.length > 100) {
        throw new Error('instruction max string characters allowed for Robot is 100')
    }
}

Robot.prototype.toString = function() {
    return `${this.x} ${this.y} ${this.compassOrientation} ${this.lost}`;
}

module.exports = Robot;