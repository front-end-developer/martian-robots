Grid = require('./grid');

let mars = new Grid('5 3');
let iRobot = new Robot('1 1 E');
iRobot.instruction('RFRFRFRF');
mars.runItem(iRobot);

let i2ndRobot = new Robot('3 2 N');
i2ndRobot.instruction('FRRFLLFFRRFLL');
mars.runItem(i2ndRobot);

let i3rdRobot = new Robot('0 3 W');
i3rdRobot.instruction('LLFFFLFLFL');
mars.runItem(i3rdRobot);