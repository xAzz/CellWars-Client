import Receiver from './Receiver.js';
import Emitter from './Emitter.js';

// Manages the connection
export default class Socket {
    static connect(ip) {
        if (this.connected) this.disconnect();

        this.ws = new WebSocket('ws://' + ip);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = () => this.onOpen();
        this.ws.onclose = () => this.onClose();
        this.ws.onmessage = (msg) => this.onMessage(msg);
        this.ws.onerror = () => this.onError();
    }

    static disconnect() {
        this.ws.close();
        this.ws = {};
    }

    static send(data) {
        if (this.connected === true) this.ws.send(data);
    }

    static onOpen() {
        this.connected = true;
        Emitter.handshake();
        Logger.success('Connection established');
    }

    static onMessage(msg) {
        Receiver.handle(msg.data);
    }

    static onClose() {
        this.connected = false;
        Logger.warn('Connection closed');
    }

    static onError() {
        this.connected = false;
        Logger.error('Connection error');
    }
}
