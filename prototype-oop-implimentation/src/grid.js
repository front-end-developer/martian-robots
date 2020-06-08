/**
 * Mark Webley
 * date:   5/06/2020
 * prototype implementation
 */

Compass = require('./compass');
Robot = require('./robot');

/**
 * @param {string}  widthAndHeight      set default width and heights for the grid terrain area
 * @constructor
 */
function Grid(widthAndHeight) {
    if (this.validation(widthAndHeight)) {
        const [gridWidth, gridHeight] = widthAndHeight.split(' ');
        this.items = [];        // list or successful Robots added for convenience
        this.lostItems = [];    // list or lost Robots added for convenience
        this.compass = [
            Compass.NORTH,
            Compass.EAST,
            Compass.SOUTH,
            Compass.WEST
        ];

        this.bound = {
            min: {x: 0, y: 0},
            max: {x: Number(gridWidth), y: Number(gridHeight)}
        }
        this.lastItemScensed = {};
    }
}

/**
 * @description     validates grid width and height
 * @param widthAndHeight {string}
 * @returns {boolean}
 */
Grid.prototype.validation = function (widthAndHeight) {
    const [gridWidth, gridHeight] = widthAndHeight.split(' ');
    if (typeof widthAndHeight === 'undefined' || isNaN(Number(gridWidth)) || isNaN(Number(gridHeight))) {
        console.error('set default grid width and height');
        return false;
    } else {
        return true;
    }
}

/**
 * @param robot {object} Robot object
 */
Grid.prototype.runItem = function (robot) {
    this.robot = robot;
    this.runItemInstruction();
}

/**
 * @description starts running the instruction inside the robot
 */
Grid.prototype.runItemInstruction = function() {
    let instructions = this.robot.itemInstruction.split('');
    instructions.forEach(instruction => {
        if (this.robot.lost) {
            return;
        }
        switch(instruction) {
            case 'L':
                this.rotateItem(-1);
                break;
            case 'R':
                this.rotateItem(1);
                break;
            case 'F':
                this.setItemMovement(instruction);
                break;
        }
    });
    this.printItemCoordinates();
}

/**
 * @description     rotate the robot
 * @param orientation
 */
Grid.prototype.rotateItem = function (orientation) {
    let newOrientation = this.compass.indexOf(this.robot.compassOrientation);
    newOrientation += orientation;
    if (newOrientation < 0) {
        newOrientation = 3;
    } else if (newOrientation > 3) {
        newOrientation = 0;
    }
    this.robot.compassOrientation = this.compass[newOrientation];
}

/**
 * @description movements for the robot
 */
Grid.prototype.setItemMovement = function () {
    let movement = {};
    switch(this.robot.compassOrientation) {
        case Compass.NORTH:
            movement.y = this.robot.y + 1;
            break;
        case Compass.EAST:
            movement.x = this.robot.x + 1;
            break;
        case Compass.SOUTH:
            movement.y = this.robot.y - 1;
            break;
        case Compass.WEST:
            movement.x = this.robot.x - 1;
            break;
    }
    this.moveItemForward(movement);
}

/**
 * @description     detects if scent is found on a plot
 * @param instruction {string}
 * @returns {boolean}
 */
Grid.prototype.isNextMovementOnScent = function (instruction) {
    if (this.lastItemScensed.toString() == '[object Object]') {
        return;
    }
    let sentFound = false;
    const scent = this.lastItemScensed.toString();
    const [gridPositionX, gridPositionY, itemOrientation] = scent.split(' ');
    const scentX = Number(gridPositionX),
        scentY = Number(gridPositionY),
        scentOrientation = itemOrientation;

    const [nextInstructionX, nextInstructionY, nextInstrOrientation] = instruction.split(' ');

    const nextX = Number(nextInstructionX),
        nextY = Number(nextInstructionY),
        nextOrientation = nextInstrOrientation;

    if (nextOrientation == scentOrientation
        && (nextX > scentX || nextY > scentY || nextX < 0 || nextY < 0)) {
        sentFound = true;
    }
    return sentFound;
}

/**
 *
 * @param movement
 */
Grid.prototype.moveItemForward = function (movement) {
    let newRobotCoordinates = {...this.robot, ...movement};
    const compareNewRobotCoordinates = function () {
            return `${newRobotCoordinates.x} ${newRobotCoordinates.y} ${newRobotCoordinates.compassOrientation} ${newRobotCoordinates.lost}`;
    }

    if (this.isNextMovementOnScent(compareNewRobotCoordinates())) {
        return;
    }

    if (this.isWithinGridBounds(newRobotCoordinates)) {
        Object.assign(this.robot, movement);
        this.items.push(this.robot);
    } else {
        this.robot.lost = 'LOST';
        this.lastItemScensed = this.robot;
        this.lostItems.push(this.robot)
    }
}

/**
 *
 * @returns {string}
 */
Grid.prototype.printItemCoordinates = function () {
    console.log('this.robot coordinates:', this.robot.toString());
    return this.robot.toString();
}

/**
 *
 * @param newRobotCoordinates {object} containts new coordinates x and y of the robot position
 * @returns {boolean|boolean}
 */
Grid.prototype.isWithinGridBounds = function (newRobotCoordinates) {
    return (newRobotCoordinates.x >= this.bound.min.x && newRobotCoordinates.x <= this.bound.max.x)
        && (newRobotCoordinates.y >= this.bound.min.y && newRobotCoordinates.y <= this.bound.max.y);
}

module.exports = Grid;