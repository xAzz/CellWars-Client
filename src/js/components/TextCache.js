export default class TextCache {
    constructor(size, color, stroke, strokeColor) {
        this.value = '';
        this.color = color || '#000000';
        this.stroke = stroke || false;
        this.strokeColor = strokeColor || '#000000';
        this.size = size || 16;
        this.canvas = null;
        this.ctx = null;
        this.dirty = false;
        this.scale = 1;
    }

    setSize(size) {
        if (this.size !== size) {
            this.size = size;
            this.dirty = true;
        }
    }

    setScale(scale) {
        if (this.scale !== scale) {
            this.scale = scale;
            this.dirty = true;
        }
    }

    setStrokeColor(strokeColor) {
        if (this.strokeColor !== strokeColor) {
            this.strokeColor = strokeColor;
            this.dirty = true;
        }
    }

    setValue(value) {
        let slowDown;
        if (!isNaN(value) && !isNaN(this.value) && this.value !== 0 && value !== 0 && this.value !== value) {
            if (Math.abs((value - this.value) / this.value) < 0.012) {
                slowDown = this.value;
                this.value = value;
            }
        }

        if (value !== this.value) {
            this.value = value;
            this.dirty = true;
        }

        if (slowDown) this.value = slowDown;
    }

    render() {
        if (this.canvas == null) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }

        if (this.dirty) {
            this.dirty = false;
            const canvas = this.canvas;
            const ctx = this.ctx;
            const value = this.value;
            const scale = this.scale;
            const fontsize = this.size;
            const font = `${fontsize}px Roboto Mono`;
            ctx.font = font;
            const h = ~~(0.2 * fontsize);
            canvas.width = (ctx.measureText(value).width + 6) * scale;
            canvas.height = (fontsize + h) * scale;
            ctx.font = font;
            ctx.scale(scale, scale);
            ctx.globalAlpha = 1;
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.color;

            if (this.stroke) {
                ctx.strokeText(value, 3, fontsize - h / 2);
            }

            ctx.fillText(value, 3, fontsize - h / 2);
        }

        return this.canvas;
    }
}
