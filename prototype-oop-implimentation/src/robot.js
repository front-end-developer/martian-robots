/**
 *  author: Mark Webley
 *  date:   8/06/2020
 */

/**
 * @description     defaultCoordinator contains: x & y coordinates
 *                  & one of the compass values either : N E S W
 *
 * @param {string}  defaultCoordinator
 * @constructor
 */
function Robot(defaultCoordinator) {
    this.validation(defaultCoordinator);
    const [x, y, orientation] = defaultCoordinator.split(' ');
    this.x = Number(x);
    this.y = Number(y);
    this.compassOrientation = orientation;
    this.lost = '';
    this.itemInstruction = '';
}

/**
 * @description    defaultCoordinator contains: x & y coordinates, and Compass values.
 *                 Validation validates the x and y coordinates and compass values are valid
 *
 * @param {string} defaultCoordinator
 */
Robot.prototype.validation = function (defaultCoordinator) {
    robotDefaults = defaultCoordinator.split(' ');
    const [x, y, orientation] = robotDefaults;
    if (robotDefaults.length < 3) {
        throw new Error('missing x y compassDirection');
    }
    if (isNaN(Number(x)) || isNaN(Number(y)) || Number(x) > 50 || Number(y) > 50
    ) {
        throw new Error('set x and y coordinates for Robot, max coordinates allowed 50')
    }
    if (Object.values(Compass).indexOf(orientation) === -1) {
        throw new Error(`define compass direction ${Object.keys(Compass)} for Robot`);
    }
}

/**
 *
 * @param {string} instruction
 */
Robot.prototype.instruction = function (instruction) {
    this.validationInstruction(instruction);
    this.itemInstruction = instruction;
}

/**
 *
 * @param instruction
 */
Robot.prototype.validationInstruction = function (instruction) {
    if (typeof instruction === 'undefined') {
        throw new Error('set instruction for robot')
    }
    if (instruction.length > 100) {
        throw new Error('instruction max string characters allowed for Robot is 100')
    }
}

/**
 *
 * @returns {string}
 */
Robot.prototype.toString = function() {
    return `${this.x} ${this.y} ${this.compassOrientation} ${this.lost}`;
}

module.exports = Robot;