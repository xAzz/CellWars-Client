import Camera from './Entities/Camera.js';
import World from './Entities/World.js';
import TextCache from './TextCache.js';

// Draws stuff on the canvas
export default class Renderer {
    // Create renderer object
    static create() {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.pi2 = Math.PI * 2;

        this.leaderboard = $('#lbPos');

        this.borderColor = '#F44336';
        this.foodColor = '#03A9F4';
        this.virusColor = '#555';
        this.virusStroke = '#24815d';

        this.fps = {
            now: 0,
            filter: 50,
            lastUpdate: (new Date) * 1,
            value: 0,
            display: 0
        };

        this.resize();
        window.onresize = () => this.resize();
    }

    // Runs in game loop
    static run() {
        this.refresh();
        this.draw();
        this.restore();
        this.calcFps();
    }

    // Refresh the screen and scale the camera
    static refresh() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Camera.scale();
    }

    // Draw the things
    static draw() {
        this.grid();
        this.border();
        this.food();
        this.cells();
    }

    // Restore context
    static restore() {
        this.ctx.restore();
    }

    // Resize the canvas
    static resize() {
        this.canvas.width = ~~window.innerWidth;
        this.canvas.height = ~~window.innerHeight;
    }

    // Draw map border
    static border() {
        let ctx = this.ctx;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 200;
        ctx.strokeRect(World.border.left - 100, World.border.top - 100, 14342, 14342);
    }

    // Draw grid
    static grid() {
        let ctx = this.ctx;
        let x1 = World.border.left,
            y1 = World.border.top,
            x2 = World.border.right,
            y2 = World.border.bottom,
            loc = ['A', 'B', 'C', 'D', 'E'],
            i, j, x, y;

        if (1) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.beginPath();
            for (i = 0; i < 6; i++) {
                x = x1 + (i * 2828);
                y = y1 + (i * 2828);
                ctx.moveTo(x, y1);
                ctx.lineTo(x, y2);
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
            };
            ctx.closePath();

            ctx.lineWidth = 150;
            ctx.strokeStyle = '#161616';
            ctx.stroke();

            ctx.font = 1600 + 'px ' + 'ubuntu';
            ctx.fillStyle = '#161616';

            for (j = 0; j < 5; j++) {
                for (i = 0; i < 5; i++) {
                    x = x1 + ~~(2828 / 2) + (i * 2828);
                    y = y1 + ~~(2828 / 2) + (j * 2828);
                    ctx.fillText(loc[j] + (i + 1), x, y);
                };
            };
        }
    }

    // Draw cells
    static cells() {
        let ctx = this.ctx;

        World.cells.forEach((cell) => {
            cell.animated.x = this.animate(cell.animated.x, cell.position.x, 6);
            cell.animated.y = this.animate(cell.animated.y, cell.position.y, 6);
            cell.animated.r = this.animate(cell.animated.r, cell.position.r, 7);

            ctx.beginPath();
            ctx.arc(cell.animated.x, cell.animated.y, cell.animated.r, 0, this.pi2, false);
            ctx.closePath();

            if (cell.type === 2) { // virus
                ctx.fillStyle = this.virusColor;
                ctx.globalAlpha = 0.7;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.lineWidth = 10;
                ctx.strokeStyle = this.virusStroke;
                ctx.stroke();
            }

            if (cell.type === 4) { // eject
                ctx.fillStyle = '#24815d';
                ctx.fill();
            }

            if (cell.type === 1) { // cell
                let cellY = ~~cell.animated.y;

                ctx.lineWidth = 0;
                ctx.fillStyle = cell.color;
                ctx.fill();

                // NAME CACHE
                let nameCache = cell.nameCache;
                nameCache.setValue(cell.name);
                nameCache.setSize(cell.getNameSize() / 1.2);

                let nameRatio = Math.ceil(10 * Camera.animated.v) / 10;
                nameCache.setScale(nameRatio);

                let name = nameCache.render();
                let nameWidth = ~~(name.width / nameRatio);
                let nameHeight = ~~(name.height / nameRatio);

                ctx.drawImage(name, ~~cell.animated.x - ~~(nameWidth / 2), cellY - ~~(nameHeight / 2), nameWidth, nameHeight);

                cellY += name.height / 2 / nameRatio + 4;

                if (cell.sizeCache == null) {
                    cell.sizeCache = new TextCache(cell.getNameSize() / 2, '#FFFFFF', true, '#000000');
                }

                // MASS CACHE
                let sizeCache = cell.sizeCache;
                sizeCache.setSize(cell.getNameSize() / 2);
                sizeCache.setValue(~~(cell.animated.r * cell.animated.r / 100));
                let sizeRatio = Math.ceil(10 * Camera.animated.v) / 10;
                sizeCache.setScale(sizeRatio);

                let size = sizeCache.render();
                let sizeWidth = ~~(size.width / sizeRatio);
                let sizeHeight = ~~(size.height / sizeRatio);

                ctx.drawImage(size, ~~cell.animated.x - ~~(sizeWidth / 2), cellY - ~~(sizeHeight / 2), sizeWidth, sizeHeight);

                // let size = cell.animated.r / 3;
                // ctx.font = '600 ' + size + 'px Roboto Mono';
                // ctx.fillStyle = '#fff';

                // LAGGGGGG
                // if (cell.name && cell.name.length > 0) {
                //     ctx.fillText(cell.name, cell.animated.x, cell.animated.y);
                // }

                // LAGGGGGG
                // let mass = ~~(cell.animated.r * cell.animated.r / 100);
                // if (mass > 100) {
                //     ctx.fillText(mass, cell.animated.x, cell.animated.y + size );
                // }
            }
        });
    }

    // Draw food
    static food() {
        let ctx = this.ctx;

        ctx.beginPath();
        World.food.forEach((food) => {
            ctx.moveTo(food.position.x + food.position.r + 4, food.position.y);
            ctx.arc(food.position.x, food.position.y, food.position.r + 4, 0, this.pi2, false);
        });
        ctx.closePath();
        ctx.fillStyle = this.foodColor;
        ctx.fill();
    }

    // Animation formula
    static animate(previous, next, factor) {
        return previous + ((next - previous) / factor);
    }

    static calcFps() {
        let current = 1000 / ((this.fps.now = Date.now()) - this.fps.lastUpdate);
        if (this.fps.now !== this.fps.lastUpdate) {
            $('#fps').text(~~this.fps.value);
            this.fps.value += (current - this.fps.value) / this.fps.filter;
            this.fps.lastUpdate = this.fps.now;
        }
    }
}
