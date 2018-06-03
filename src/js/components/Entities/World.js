import Cell from './Cell.js';
import Player from './Player.js';

// Container for our cell objects
export default class World {
    // Creates a world object
    static create() {
        this.cells = [];
        this.food = [];
        this.border = {top: -7071, bottom: 7071, left: -7071, right: 7071};
    }

    // Add cell
    static addCell(cell) {
        let newCell = new Cell(cell.id, cell.x, cell.y, cell.r, cell.color, cell.name, cell.type);
        if (cell.type !== 3) {
            this.cells[cell.id] = newCell;
        } else {
            this.food[cell.id] = newCell;
        }

        if (cell.type === 1 && Player.cellIds.indexOf(cell.id) > -1) {
            Player.cells[cell.id] = newCell;
            Player.isSpawned = true;
        }
    }

    // Remove cell
    static removeCell(cell) {
        if (cell.type !== 3) {
            if (cell.id in this.cells) {
                this.cells[cell.id] = null;
                delete this.cells[cell.id];
            }

            if (cell.id in Player.cells) {
                Player.cells[cell.id] = null;
                delete Player.cells[cell.id];
            }
        } else {
            this.food[cell.id] = null;
            delete this.food[cell.id];
        }
    }

    // Update cell
    static updateCell(cell) {
        if (cell.type !== 3) {
            if (cell.id in this.cells) {
                this.cells[cell.id].position.x = cell.x;
                this.cells[cell.id].position.y = cell.y;

                if (this.cells[cell.id].position.r !== cell.r) {
                    this.cells[cell.id].position.r = cell.r;
                    this.sortCells();
                }
            }
        } else {
            this.food[cell.id].position.x = cell.x;
            this.food[cell.id].position.y = cell.y;
        }
    }

    // Sort cells, virus, eject
    static sortCells() {
    }
}
