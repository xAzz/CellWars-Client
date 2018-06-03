import Socket from './Socket.js';
import Writer from './Modules/Writer.js';

// Creates and sends packets to server
export default class Emitter {
    static emit(buffer) {
        Socket.send(buffer);
    }

    static connect(server) {
        Socket.connect(server);

        this.packets = {
            handshake: 0,
            spawn: 10,
            splitCell: 20,
            ejectMass: 30,
            move: 40
        };
    }

    static disconnect() {
        Socket.disconnect();
    }

    static handshake() {
        Writer.init();
        Writer.writeUInt8(this.packets.handshake);
        Writer.writeUInt8(57);
        this.emit(Writer.toBuffer());
    }

    static spawn(name) {
        Writer.init();
        Writer.writeUInt8(this.packets.spawn);
        Writer.writeStringUtf8(name);
        this.emit(Writer.toBuffer());
    }

    static splitCell() {
        Logger.info('Split cell');
        Writer.init();
        Writer.writeUInt8(this.packets.splitCell);
        this.emit(Writer.toBuffer());
    }

    static ejectMass() {
        Logger.info('Eject');
        Writer.init();
        Writer.writeUInt8(this.packets.ejectMass);
        this.emit(Writer.toBuffer());
    }

    static move(x, y) {
        Writer.init();
        Writer.writeUInt8(this.packets.move);
        Writer.writeInt16(~~x);
        Writer.writeInt16(~~y);
        this.emit(Writer.toBuffer());
    }

    static eject() {
        Writer.init();
        Writer.writeUInt8(this.packets.eject);
        this.emit(Writer.toBuffer());
    }

    static split() {
        Writer.init();
        Writer.writeUInt8(this.packets.split);
        this.emit(Writer.toBuffer());
    }

    static spectate() {
        Writer.init();
        Writer.writeUInt8(this.packets.spectate);
        this.emit(Writer.toBuffer());
    }
}
