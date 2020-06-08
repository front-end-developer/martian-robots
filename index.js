/**
 * Mark Webley
 * prototype implimentation | TODO: class implimentation | Typescript Implimentation
 */
// enum
const Compass = {
    N: 'NORTH',
    S: 'SOUTH',
    E: 'EAST',
    W: 'WEST'
};

// orientation
const Rotation = {
    N: 0,
    S: 90,
    E: 180,
    W: 360
};

// each gridPlot may have
const plot = {
    point: {
        x:0,
        y:0
    },
    isOccupiad: false,
    isScensed: false
};


// export
// 1 1 E
function Robot(defaultCoordinator) {
    // TODO: if typeof defaultCoordinator not == 'string', use ES6 version
    this.validation(defaultCoordinator);
    let robotDefaults = defaultCoordinator.split(' ');
    this.x = defaultCoordinator[0];
    this.y = defaultCoordinator[1];

    // rotation
    this.compassOrientation = defaultCoordinator[2]; // Compass.N;
    this.lost = '';
    // this.direction = ;
}

Robot.prototype.validation = function (defaultCoordinator) {
    let robotDefaults = defaultCoordinator.split(' ');
    if (robotDefaults.length < 3) {
        throw new Error('missing x y compassDirection');
    }
    if (isNaN(Number(robotDefaults[0])) || isNaN(Number(robotDefaults[1]))) {
        throw new Error('set x and y coordinates for Robot')
    }
    if (Object.keys(Compass).indexOf(robotDefaults[2]) === -1) {
        throw new Error(`define compass direction ${Object.keys(Compass)} for Robot`);
    }
}

Robot.prototype.instruction = function (instruction) {
    this.validationInstruction(instruction);
    this.instruction = instruction;
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
    let robotToString = `3 3 N LOST ${this.x} ${this.y} ${this.compassOrientation} ${this.lost}`;
    console.log('Robot.toString: ', robotToString);
    return robotToString;
}

// export
// new grid x5 width, y5 height
function Grid(widthAndHeight) {
    this.validation(widthAndHeight);
    this.items = [];    // list or successful Robots added for convenience
    this.compass = [
        Compass.N,
        Compass.E,
        Compass.S,
        Compass.E
    ];

    this.bound = {
        min: {x: 0, y: 0},
        max: {x: 2, y: 2} // x: widthAndHeight[0], y: widthAndHeight[1]
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
    let test = 'RFRFRFRF';
    let instructions = test.split('');
    instructions.forEach(instruction => {
        // TODO: if first instruction is L or R run:
        // TODO: if instruction is F setItemMovement
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
        case Compass.N:
            movement.y = this.robot.y + 1;
            break;
        case Compass.E:
            movement.x = this.robot.x + 1;
            break;
        case Compass.S:
            movement.y = this.robot.y - 1;
            break;
        case Compass.W:
            movement.x = this.robot.x - 1;
            break;
    }
    this.moveItemForward(movement);
}

Grid.prototype.moveItemForward = function (movement) {
    let newRobotCoordinates = {...this.robot, movement};

    // TODO: double check to make sure this is done properly
    if (this.lastItemScensed.toString() === newRobotCoordinates.toString()) {
        return;
    }
    if (this.isWithinGridBounds(newRobotCoordinates)) {
        this.items.push(this.robot);
    } else {
        this.robot.lost = 'LOST';
        this.lastItemScensed = this.robot;
    }
}

Grid.prototype.printItemCoordinates = function () {
    console.log('this.robot coordinates:', this.robot.toString());
}

Grid.prototype.isWithinGridBounds = function () {
    return (this.robot.x >= this.bound.min.x && this.robot.x <= bounds.max.x) && (this.robot.y >= this.bound.min.y && this.robot.y <= bounds.max.y);
}


// grid class: contains maxWidth, maxHeight

// grid class: contains method: grid.point(x, y)

// grid class: contains method: grid.moveItem(Robot, Instruction: {})

// grid class: contains method gridValidation() Max Length 50

// grid class: contains method: grid.setScent() // set scent

// grid class: contains method: grid.getScent() // get latest and current scent

// Optional
// grid class: contains method: grid.getScents(), returns an array of sents

// grid class: contains scents:[]

// que of robots WITH instructions
// grid class: contains robots:[]

// grid class OR Robot class: contains method: robot.outputJSON() RETURNS {X: d, y: d, compass: N|S|E|W, scent: true|false}

// grid class OR Robot class: contains method: robot.outputString() RETURNS x y, N true




// grid class: contains method:

// new robot, x:1, y:1, orientation: E

// robot class: contains method robotValidation() Max x = 50, Max y = 50

// robot class: contains axis by orientation of degress, 0/360, 90 180, 270

// robot class: contains compass: N, S, E, W perhaps as enums N: 'NORTH', S: 'SOUTH', E: 'EAST', W: 'WEST'

// robot class: contains method instructionValidation() Max Length 100



// robot class: contains position: x: digit, y: digit


// Test
let mars = new Grid('2 2');
let iRobot = new Robot('1 1 E');
iRobot.instruction('RFRFRFRF');
mars.runItem(iRobot);


module.exports = {
    Robot, Grid
}