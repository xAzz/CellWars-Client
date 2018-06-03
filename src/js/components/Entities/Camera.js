import Player from './Player.js';
import Renderer from '../Renderer.js';

export default class Camera {
    // Creates a camera object
    static create() {
        this.position = {x: 0, y: 0, v: 0.1};
        this.animated = {x: 0, y: 0, v: 0.1};
        this.zoomFactor = 0.9;

        $('#canvas').on('wheel', (e) => this.zoom(e));
    }

    // Runs in game loop
    static run() {
        this.animate();
        this.move();
    }

    static animate() {
        this.animated.x = Renderer.animate(this.animated.x, this.position.x, 5);
        this.animated.y = Renderer.animate(this.animated.y, this.position.y, 5);
        this.animated.v = Renderer.animate(this.animated.v, this.position.v, 8);
    }

    // Scale camera (animated)
    static scale() {
        let x = ((Renderer.canvas.width / 2) / this.animated.v) - this.animated.x;
        let y = ((Renderer.canvas.height / 2) / this.animated.v) - this.animated.y;

        Renderer.ctx.scale(this.animated.v, this.animated.v);
        Renderer.ctx.translate(~~x, ~~y);
    }

    // Calc zoom visibility
    static zoom(e) {
        if (e.originalEvent.wheelDelta < 0) {
            this.position.v *= this.zoomFactor;
        } else {
            this.position.v /= this.zoomFactor;
        }

        if (this.position.v < 0.02) {
            this.position.v = 0.02;
        }

        if (this.position.v > 4 / this.position.v) {
            this.position.v = 4 / this.position.v;
        }
    }

    // Move camera to center position
    static move() {
        let center = this.center();
        this.position.x = center.x;
        this.position.y = center.y;
    }

    // Calc camera center position
    static center() {
        let center = {x: 0, y: 0};
        let total = {x: 0, y: 0};
        let i = 0;

        // Sum x and y of player cells
        Player.cells.forEach((cell) => {
            total.x = total.x + Player.cells[cell.id].position.x;
            total.y = total.y + Player.cells[cell.id].position.y;
            i++;
        });

        if (Player.isSpawned && i === 0) {
            Player.isSpawned = false;
            Player.isAlive = false;
            $('#overlay').toggle();
        }

        // Return camera center
        if (i > 0) {
            center = {
                x: total.x / i,
                y: total.y / i
            };
        }

        return center;
    }
}
