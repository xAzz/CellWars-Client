import Emitter from '../Emitter.js';
import World from './World.js';

// Represents one player
export default class Player {
    // Creates a player object
    static create() {
        this.cells = [];
        this.cellIds = [];
        this.score = 0;
        this.isAlive = false;
        this.isSpawned = false;
        this.isMoving = true;

        // Listen on connect and play
        $('#spawn').on('click', () => {
            if (this.isAlive) return;
            this.spawn($('#nickname').val());
        });
    }

    // Connect this player
    static connect(server) {
        Emitter.connect(server);
    }

    // Flush cell data
    static flush() {
        this.create();
        World.create();
    }

    // Disconnect from server
    static disconnect() {
        this.isAlive = false;
        Emitter.disconnect();
    }

    // Spawn this player
    static spawn(nickname) {
        this.isAlive = true;
        $('#overlay').hide();
        Emitter.spawn(nickname);
    }

    // Split action
    static splitCell() {
        Emitter.splitCell();
    }

    // Eject mass
    static ejectMass() {
        Emitter.ejectMass();
    }

    // Add a new cell id to array
    static addCellId(cellId) {
        this.cellIds.push(cellId);
    }
}
