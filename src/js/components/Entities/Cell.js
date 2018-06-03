import TextCache from '../TextCache.js';

export default class Cell {
    constructor(id, x, y, r, color, name, type) {
        this.id = id;
        this.position = {x: x, y: y, r: r};
        this.animated = {x: x, y: y, r: r};
        this.color = color;
        this.name = name;
        this.type = type;
        this.nameCache = null;
        this.sizeCache = null;
        this.setNameCache(name);
    }

    getNameSize() {
        return Math.max(~~(0.3 * this.animated.r), 24);
    }

    setNameCache(name) {
        if (this.nameCache === null) {
            this.nameCache = new TextCache(this.getNameSize(), '#FFFFFF', true, '#000000');
            this.nameCache.setValue(this.name);
        } else {
            this.nameCache.setSize(this.getNameSize());
            this.nameCache.setValue(this.name);
        }
    }
}
