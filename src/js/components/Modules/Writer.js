export default class Writer {
    static init(size) {
        if (!size || size <= 0) {
            size = Buffer.poolSize / 2;
        }
        this._buffer = Buffer.allocUnsafe(size);
        this._length = 0;
    }

    static writeUInt8(value) {
        this.checkAlloc(1);
        this._buffer[this._length++] = value;
    }

    static writeInt8(value) {
        this.checkAlloc(1);
        this._buffer[this._length++] = value;
    }

    static writeUInt16(value) {
        this.checkAlloc(2);
        this._buffer[this._length++] = value;
        this._buffer[this._length++] = value >> 8;
    }

    static writeInt16(value) {
        this.checkAlloc(2);
        this._buffer[this._length++] = value;
        this._buffer[this._length++] = value >> 8;
    }

    static writeUInt32(value) {
        this.checkAlloc(4);
        this._buffer[this._length++] = value;
        this._buffer[this._length++] = value >> 8;
        this._buffer[this._length++] = value >> 16;
        this._buffer[this._length++] = value >> 24;
    }

    static writeInt32(value) {
        this.checkAlloc(4);
        this._buffer[this._length++] = value;
        this._buffer[this._length++] = value >> 8;
        this._buffer[this._length++] = value >> 16;
        this._buffer[this._length++] = value >> 24;
    }

    static writeFloat(value) {
        this.checkAlloc(4);
        this._buffer.writeFloatLE(value, this._length, true);
        this._length += 4;
    }

    static writeDouble(value) {
        this.checkAlloc(8);
        this._buffer.writeDoubleLE(value, this._length, true);
        this._length += 8;
    }

    static writeBytes(data) {
        this.checkAlloc(data.length);
        data.copy(this._buffer, this._length, 0, data.length);
        this._length += data.length;
    }

    static writeStringUtf8(value) {
        let length = Buffer.byteLength(value, 'utf8');
        this.checkAlloc(length);
        this._buffer.write(value, this._length, 'utf8');
        this._length += length;
    }

    static writeStringUnicode(value) {
        let length = Buffer.byteLength(value, 'ucs2');
        this.checkAlloc(length);
        this._buffer.write(value, this._length, 'ucs2');
        this._length += length;
    }

    static writeStringZeroUtf8(value) {
        this.writeStringUtf8(value);
        this.writeUInt8(0);
    }

    static writeStringZeroUnicode(value) {
        this.writeStringUnicode(value);
        this.writeUInt16(0);
    }

    static getLength() {
        return this._length;
    }

    static reset() {
        this._length = 0;
    }

    static toBuffer() {
        return Buffer.concat([this._buffer.slice(0, this._length)]);
    }

    static checkAlloc(size) {
        let needed = this._length + size;
        if (this._buffer.length >= needed) { return; }
        let chunk = Math.max(Buffer.poolSize / 2, 1024);
        let chunkCount = (needed / chunk) >>> 0;
        if ((needed % chunk) > 0) {
            chunkCount += 1;
        }
        let buffer = Buffer.allocUnsafe(chunkCount * chunk);
        this._buffer.copy(buffer, 0, 0, this._length);
        this._buffer = buffer;
    }
}

