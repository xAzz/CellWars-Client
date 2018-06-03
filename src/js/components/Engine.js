import Renderer from './Renderer.js';
import Hotkeys from './Hotkeys.js';
import Auth from './Auth.js';

import Player from './Entities/Player.js';
import World from './Entities/World.js';
import Camera from './Entities/Camera.js';
import Mouse from './Entities/Mouse.js';

// Creates game objects and executes the loops
export default class Engine {
    // Starting point
    static start() {
        // Authenticate
        Auth.init();

        // Create objects
        Player.create();
        World.create();
        Camera.create();
        Renderer.create();
        Mouse.create();
        Hotkeys.create();

        // Run loops
        setInterval(() => this.mouseLoop(), 33);
        this.gameLoop();

        Logger.info('Engine started');
    }

    // Main game loop
    static gameLoop() {
        if (Player.isAlive) {
            Renderer.run();
            Camera.run();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    // Loop for sending mouse coords
    static mouseLoop() {
        if (!Player.isAlive) return;
        Mouse.run();
    }
}
