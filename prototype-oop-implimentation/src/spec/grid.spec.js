const Grid = require('../grid');
const Robot = require('../robot');
describe("grid", function () {
    const gridSizeMock = '5 3';
    const instructionMock = 'RFRFRFRF';
    let grid = new Grid(gridSizeMock);
    let iRobot;
    beforeEach(() => {
        iRobot = new Robot('1 1 E');
        iRobot.instruction(instructionMock);
    });
    describe("grid", function () {
        it("should return grid object from raw grid data", () => {
            const gridBoundary = {
                min: {x: 0, y: 0},
                max: {x: 5, y: 3}
            };
            expect(grid.bound).toEqual(gridBoundary);
        });

        it("should validate grid data with an error", () => {
            let isValid = grid.validation(gridSizeMock);
            expect(isValid).toBe(true);
        });

        it("should inValidate grid data with an error", () => {
            let isValid = grid.validation('');
            expect(isValid).toBe(false);
        });

        // runItem
        it("should contain a robot", () => {
            grid.runItem(iRobot);
            expect(grid.robot).toBe(iRobot);
        });

        it("should call runItemInstruction", () => {
            spyOn(grid, 'runItemInstruction');
            grid.runItem(iRobot);
            expect(grid.runItemInstruction).toHaveBeenCalled();
        });

        it("should rotate an item on the grid, via of rotateItem", () => {
            spyOn(grid, 'rotateItem');
            grid.runItem(iRobot);
            expect(grid.rotateItem).toHaveBeenCalled();
        });

        it("should move an item on the grid via of setItemMovement", () => {
            spyOn(grid, 'setItemMovement');
            grid.runItem(iRobot);
            expect(grid.setItemMovement).toHaveBeenCalled();
        });

        it("should detect scent in current process instruction via isNextMovementOnScent", () => {
            spyOn(grid, 'isNextMovementOnScent');
            grid.runItem(iRobot);
            expect(grid.isNextMovementOnScent).toHaveBeenCalled();
        });

        it("should move an item on the grid forward via moveItemForward", () => {
            spyOn(grid, 'moveItemForward');
            grid.runItem(iRobot);
            expect(grid.moveItemForward).toHaveBeenCalled();
        });

        it("should return item coordinates via printItemCoordinates", () => {
            iRobot = new Robot('3 2 N');
            iRobot.instruction('FRRFLLFFRRFLL');
            grid.runItem(iRobot);
            const coord = grid.printItemCoordinates();
            expect(coord).toEqual('3 3 N LOST');
        });

        it("should check if an item is within the bounds of the grid via isWithinGridBounds", () => {
            spyOn(grid, 'isWithinGridBounds');
            grid.runItem(iRobot);
            expect(grid.isWithinGridBounds).toHaveBeenCalled();
        });
    });
})
