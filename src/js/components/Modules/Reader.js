export default class Reader {
    static init(buffer) {
        this._offset = 0;
        this._buffer = Buffer.from(buffer);
    }

    static readUInt8() {
        let value = this._buffer.readUInt8(this._offset);
        this._offset += 1;
        return value;
    }

    static readInt8() {
        let value = this._buffer.readInt8(this._offset);
        this._offset += 1;
        return value;
    }

    static readUInt16() {
        let value = this._buffer.readUInt16LE(this._offset);
        this._offset += 2;
        return value;
    }

    static readInt16() {
        let value = this._buffer.readInt16LE(this._offset);
        this._offset += 2;
        return value;
    }

    static readUInt32() {
        let value = this._buffer.readUInt32LE(this._offset);
        this._offset += 4;
        return value;
    }

    static readInt32() {
        let value = this._buffer.readInt32LE(this._offset);
        this._offset += 4;
        return value;
    }

    static readFloat() {
        let value = this._buffer.readFloatLE(this._offset);
        this._offset += 4;
        return value;
    }

    static readDouble() {
        let value = this._buffer.readDoubleLE(this._offset);
        this._offset += 8;
        return value;
    }

    static readBytes(length) {
        return this._buffer.slice(this._offset, this._offset + length);
    }

    static skipBytes(length) {
        this._offset += length;
    }

    static readStringUtf8(length) {
        if (length == null) length = this._buffer.length - this._offset;
        length = Math.max(0, length);
        let value = this._buffer.toString('utf8', this._offset, this._offset + length);
        this._offset += length;
        return value;
    }

    static readStringUnicode(length) {
        if (length == null) length = this._buffer.length - this._offset;
        length = Math.max(0, length);
        let safeLength = length - (length % 2);
        safeLength = Math.max(0, safeLength);
        let value = this._buffer.toString('ucs2', this._offset, this._offset + safeLength);
        this._offset += length;
        return value;
    }

    static readStringZeroUtf8() {
        let length = 0;
        let terminatorLength = 0;
        for (let i = this._offset; i < this._buffer.length; i++) {
            if (this._buffer.readUInt8(i) === 0) {
                terminatorLength = 1;
                break;
            }
            length++;
        }
        let value = this.readStringUtf8(length);
        this._offset += terminatorLength;
        return value;
    }

    static readStringZeroUnicode() {
        let length = 0;
        let terminatorLength = ((this._buffer.length - this._offset) & 1) !== 0 ? 1 : 0;
        for (let i = this._offset; i + 1 < this._buffer.length; i += 2) {
            if (this._buffer.readUInt16LE(i) === 0) {
                terminatorLength = 2;
                break;
            }
            length += 2;
        }
        let value = this.readStringUnicode(length);
        this._offset += terminatorLength;
        return value;
    }
}
