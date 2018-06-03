import Reader from './Modules/Reader.js';
import Player from './Entities/Player.js';
import World from './Entities/World.js';
import Renderer from './Renderer.js';

// Handles incoming packets
export default class Receiver {
    static handle(buffer) {
        if (!this.packets) {
            this.packets = {100: () => this.handshake()};
        }

        Reader.init(buffer);
        let id = Reader.readUInt8();

        if (id in this.packets) {
            this.packets[id]();
        }
    }

    static handshake() {
        let handshake = Reader.readUInt8();

        if (handshake === 57) {
            Logger.success('Handshake received');
            this.packets = {
                110: () => this.reset(),
                120: () => this.border(),
                130: () => this.playerCellId(),
                140: () => this.leaderboard(),
                150: () => this.cells()
                // 160: () => this.team()
            };
        }
    }

    static reset() {
        World.cells = [];
        World.food = [];
        Player.cells = [];
        Player.cellIds = [];

        Logger.success(`Cells cleared`);
    }

    static border() {
        let border = {
            top: Reader.readDouble(),
            bottom: Reader.readDouble(),
            left: Reader.readDouble(),
            right: Reader.readDouble()
        };

        World.border = border;
        Logger.success(`Border received`);
    }

    static playerCellId() {
        let playerCellId = Reader.readUInt32();
        Player.addCellId(playerCellId);
        Logger.success(`Player cell received`);
    }

    static leaderboard() {
        let row = '';
        let length = Reader.readUInt8();
        for (let i = 0; i < length; i++) {
            let name = Reader.readStringZeroUtf8();
            let highlight = Reader.readUInt8();
            let highlightClass = (highlight) ? 'lbHighlight' : '';
            let rank = i + 1;
            row += `<span class="${highlightClass}">${rank}. ${name}</span>`;
        }

        Renderer.leaderboard.html(row);
    }

    static cells() {
        if (Player.isAlive) {
            this.eatenCells();
            this.removeCells();
            this.addCells();
            this.updateCells();
        }
		//Logger.success(`Cells received`);
    }

    static eatenCells() {
        let cell = {};

        let length = Reader.readUInt16();
        while (length--) {
            cell.type = Reader.readUInt8();
            cell.id = Reader.readUInt32();
            cell.hunterId = Reader.readUInt32();
            World.removeCell(cell);
        }
    }

    static removeCells() {
        let cell = {};

        let length = Reader.readUInt16();
        while (length--) {
            cell.type = Reader.readUInt8();
            cell.id = Reader.readUInt32();
            World.removeCell(cell);
        }
    }

    static addCells() {
        let cell = {};

        let length = Reader.readUInt16();
		Logger.success(`Cellszz received ${length}`);
        while (length--) {
            cell.type = Reader.readUInt8();
            cell.id = Reader.readUInt32();
            cell.x = Reader.readInt16();
            cell.y = Reader.readInt16();
            cell.r = Reader.readUInt16();
            cell.color = '';
            cell.name = '';

            if (cell.type === 1 || cell.type === 4) {
                cell.color = `rgb(${Reader.readUInt8()}, ${Reader.readUInt8()}, ${Reader.readUInt8()})`;
                if (cell.type === 1) {cell.name = Reader.readStringZeroUtf8();
					
				}
			}
			
            World.addCell(cell);
        }
    }

    static updateCells() {
        let cell = {};

        let length = Reader.readUInt16();
        while (length--) {
            cell.type = Reader.readUInt8();
            cell.id = Reader.readUInt32();
            cell.x = Reader.readInt16();
            cell.y = Reader.readInt16();
            cell.r = Reader.readUInt16();
            World.updateCell(cell);
        }
    }
}
