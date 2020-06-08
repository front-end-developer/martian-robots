/**
 * Mark Webley
 * prototype implimentation | TODO: class implimentation | Typescript Implimentation
 */

// enum
const Compass = {
    NORTH: 'N',
    SOUTH: 'S',
    EAST: 'E',
    WEST: 'W'
};


// export
// 1 1 E
function Robot(defaultCoordinator) {
    // TODO: if typeof defaultCoordinator not == 'string', use ES6 version
    this.validation(defaultCoordinator);
    let robotDefaults = defaultCoordinator.split(' ');
    this.x = Number(robotDefaults[0]);
    this.y = Number(robotDefaults[1]);
    // rotation
    this.compassOrientation = robotDefaults[2]; // Compass.N;
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

// export
// new grid x5 width, y5 height
function Grid(widthAndHeight) {
    this.validation(widthAndHeight);
    let gridDefaults = widthAndHeight.split(' ');
    this.items = [];    // list or successful Robots added for convenience
    this.lostItems = [];    // list or lost Robots added for convenience
    this.compass = [
        Compass.NORTH,
        Compass.EAST,
        Compass.SOUTH,
        Compass.WEST
    ];

    this.bound = {
        min: {x: 0, y: 0},
        max: {x: Number(gridDefaults[0]), y: Number(gridDefaults[1])}
    }
    this.lastItemScensed = {};
}

Grid.prototype.validation = function (widthAndHeight) {
    let gridDefaults = widthAndHeight.split(' ');
    if (typeof gridDefaults === 'undefined' || isNaN(Number(gridDefaults[0])) || isNaN(Number(gridDefaults[1]))) {
        throw new Error('set default grid width and height');
    }
}

Grid.prototype.runItem = function (robot) {
    this.robot = robot;
    this.runItemInstruction();
}

Grid.prototype.runItemInstruction = function() {
    let instructions = this.robot.itemInstruction.split('');
    instructions.forEach(instruction => {
        // TODO: if first instruction is L or R run:
        // TODO: if instruction is F setItemMovement
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

// RFRFRFRF
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

Grid.prototype.isNextMovementOnScent = function (instruction) {
    if (this.lastItemScensed.toString() == '[object Object]') {
        return;
    }
    let sentFound = false;
    const scent = this.lastItemScensed.toString(); // '3 3 N LOST';
    const scentData = scent.split(' ');
    const scentX = Number(scentData[0]),
        scentY = Number(scentData[1]),
        scentOrientation = scentData[2];

    const nextInstruction = instruction.split(' '); // '3 4 N'.split(' ');
    const nextX = Number(nextInstruction[0]),
        nextY = Number(nextInstruction[1]),
        nextOrientation = nextInstruction[2];

    if (nextOrientation == scentOrientation
        && (nextX > scentX || nextY > scentY || nextX < 0 || nextY < 0)) {
        sentFound = true;
    }
    return sentFound;
}

Grid.prototype.moveItemForward = function (movement) {
    let newRobotCoordinates = {...this.robot, ...movement};
    const compareNewRobotCoordinates = function () {
            return `${newRobotCoordinates.x} ${newRobotCoordinates.y} ${newRobotCoordinates.compassOrientation} ${newRobotCoordinates.lost}`;
    }

    if (this.isNextMovementOnScent(compareNewRobotCoordinates())) {
        return;
    }

    if (this.isWithinGridBounds(newRobotCoordinates)) { // this.robot
        Object.assign(this.robot, movement);
        this.items.push(this.robot);
    } else {
        this.robot.lost = 'LOST';
        this.lastItemScensed = this.robot;
        this.lostItems.push(this.robot)
    }
}

Grid.prototype.printItemCoordinates = function () {
    console.log('this.robot coordinates:', this.robot.toString());
}

Grid.prototype.isWithinGridBounds = function (newRobotCoordinates) {
    return (newRobotCoordinates.x >= this.bound.min.x && newRobotCoordinates.x <= this.bound.max.x)
        && (newRobotCoordinates.y >= this.bound.min.y && newRobotCoordinates.y <= this.bound.max.y);
}

// Test
let mars = new Grid('5 3');
// let iRobot = new Robot('1 1 E');
// iRobot.instruction('RFRFRFRF');
// mars.runItem(iRobot);

let i2ndRobot = new Robot('3 2 N');
i2ndRobot.instruction('FRRFLLFFRRFLL');
mars.runItem(i2ndRobot);

let i3rdRobot = new Robot('0 3 W');
i3rdRobot.instruction('LLFFFLFLFL');
mars.runItem(i3rdRobot);

module.exports = {
    Robot, Grid
}