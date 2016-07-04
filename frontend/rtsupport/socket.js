import {EventEmitter} from 'events';

class Socket {
  constructor(ws = new WebSocket('ws://echo.websocket.org'), ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;

    this.ws.onmessage = this.messageReceived.bind(this);
    this.ws.onopen = this.opened.bind(this);
    this.ws.onclose = this.closed.bind(this);
  }

  on(name, fn) {
    this.ee.on(name, fn);
  }

  off(name, fn){
    this.ee.removeListener(name, fn);
  }

  emit(name, data) {
    const message = JSON.stringify({name, data});
    this.ws.send(message);
  }

  opened(e) {
    this.ee.emit('connected');
  }

  closed(e) {
    this.ee.emit('disconnected')
  }

  messageReceived(e) {
      try{
        const message = JSON.parse(e.data);
        this.ee.emit(message.name, message.data);
      }
      catch(err) {
        this.ee.emit('error', err);
      }
  }

}

export default Socket;
