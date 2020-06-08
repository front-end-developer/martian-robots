/**
 * Mark Webley
 * date:   5/06/2020
 * prototype implementation | TODO: class implementation | Typescript implementation
 */

Compass = require('./compass');
Robot = require('./robot');

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
    const scent = this.lastItemScensed.toString();
    const scentData = scent.split(' ');
    const scentX = Number(scentData[0]),
        scentY = Number(scentData[1]),
        scentOrientation = scentData[2];

    const nextInstruction = instruction.split(' ');
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

    if (this.isWithinGridBounds(newRobotCoordinates)) {
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
    return this.robot.toString();
}

Grid.prototype.isWithinGridBounds = function (newRobotCoordinates) {
    return (newRobotCoordinates.x >= this.bound.min.x && newRobotCoordinates.x <= this.bound.max.x)
        && (newRobotCoordinates.y >= this.bound.min.y && newRobotCoordinates.y <= this.bound.max.y);
}

module.exports = Grid;