import Player from './Entities/Player.js';

// Player hotkeys
export default class Hotkeys {
    static create() {
        this.pressed = false;

        $(document).on('keydown', (e) => this.keydown(e));
        $(document).on('keyup', (e) => this.keyup(e));
    }

    static keydown(e) {
        if ($(e.target).is('input, textarea, select')) return;
        if (this.pressed) return;
        this.pressed = true;

        switch (e.keyCode) {
            case keycode('w'): this.eject(); break;
            case keycode('a'): this.multiSplit(); break;
            case keycode('s'): this.freeze(); break;
            case keycode('d'): this.doubleSplit(); break;
            case keycode('space'): this.split(); break;
            case keycode('escape'): this.overlay(); break;
        }
    }

    static keyup(e) {
        this.pressed = false;
    }

    static overlay() {
        $('#overlay').toggle();
    }

    static freeze() {
        Player.isMoving = !Player.isMoving;
    }

    static split() {
        Player.splitCell();
    }

    static doubleSplit() {
        Player.splitCell();
        setTimeout(() => Player.splitCell(), 100);
    }

    static multiSplit() {
        Player.splitCell();
        setTimeout(() => Player.splitCell(), 50);
        setTimeout(() => Player.splitCell(), 100);
        setTimeout(() => Player.splitCell(), 150);
    }

    static eject() {
        if (this.pressed) {
            Player.ejectMass();
            setTimeout(() => this.eject(), 150);
        }
    }
}
