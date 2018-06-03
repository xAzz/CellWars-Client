import Emitter from '../Emitter.js';
import Renderer from '../Renderer.js';
import Camera from './Camera.js';
import Player from './Player.js';

export default class Mouse {
    // Create mouse object
    static create() {
        this.x = 0;
        this.y = 0;

        // Mouse listener
        $('#canvas').on('mousemove', (e) => this.coords(e));
    }

    // Runs in mouse loop
    static run() {
        let coords = this.relative();
        Emitter.move(~~coords.x, ~~coords.y);
    }

    // Update mouse coords
    static coords(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }

    // Calc relative mouse coords
    static relative() {
        let relative = {x: 0, y: 0};

        if (Player.isMoving) {
            relative.x = Camera.position.x + ((this.x - (Renderer.canvas.width / 2)) / Camera.position.v);
            relative.y = Camera.position.y + ((this.y - (Renderer.canvas.height / 2)) / Camera.position.v);
        } else {
            relative.x = Camera.position.x;
            relative.y = Camera.position.y;
        }

        return relative;
    }
}
