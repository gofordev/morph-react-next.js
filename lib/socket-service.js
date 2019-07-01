import EventEmitter from "events"
import SockJS from "sockjs-client"

export const createEmitter = morphId => {
  const sock = new SockJSReconnect(process.env.SOCKJS_SERVER)

  // set up pub-sub
  const tickerEmitter = new EventEmitter()
  tickerEmitter.subscribe = (msgType, cb) => {
    tickerEmitter.on(msgType, cb)
    // return an unsubscriber, a la redux store
    return () => {
      tickerEmitter.off(msgType, cb)
      sock.close()
    }
  }
  sock.onmessage = msg => {
    const data = JSON.parse(msg.data)
    if (data.type === "ticker") {
      tickerEmitter.emit(messageTypes.TICKER_UPDATE, data)
    }
    if (data.type === "tx") {
      tickerEmitter.emit(messageTypes.TRADE_UPDATE, data)
    }
  }
  sock.connect()

  const socketSend = data => {
    if (sock.connected()) {
      sock.send(data)
    } else {
      setTimeout(socketSend, 500, data)
    }
  }
  if (morphId) {
    socketSend(JSON.stringify({ type: "join", channel: morphId }))
  }
  return tickerEmitter
}

export const messageTypes = {
  TRADE_UPDATE: "TRADE_UPDATE",
  TICKER_UPDATE: "TICKER_UPDATE"
}

// Implementation from
// https://github.com/knowitnothing/sockjs_reconnect/blob/master/sockjs_reconnect.coffee
class SockJSReconnect {
  constructor(path, reconnectOptions, statusCb) {
    let reconnect = {
      // Are we reconnecting ?
      reconnecting: false,
      // Do (not) try to reconnect.
      doNotReconnect: false,
      reloadAfterN: true,
      // Try to reconnect this many times before reloading.
      maxRetries: 60,
      // After n attemps, restore the timeout to default.
      resetMult: 6,

      // Default timeout in ms.
      retryTimeout: 1500 + Math.floor(Math.random() * 60),
      // After a failed attempt, multiply the current timeout by this much.
      retryMultiplier: 2,

      retryCurrMultiplier: 0,
      retryCurrTimeout: 0,
      // Attempts so far.
      retryCount: 0
    }

    // Merge settings.
    for (const prop in reconnectOptions) {
      if (reconnectOptions[prop] !== undefined) {
        reconnect[prop] = reconnectOptions[prop]
      }
    }

    this.reconnect = reconnect
    this.clientPath = path
    this.onstatus = typeof statusCb === "function" ? statusCb : status => {}
    this.onmessage = null
    this.conn = null
    this.isOpen = false
    this.initialDoNotReconnect = reconnect.doNotReconnect
  }

  connect() {
    if (this.conn) {
      this.conn.close()
      this.conn = null
    }
    this.reconnect.doNotReconnect = this.initialDoNotReconnect
    this.conn = new SockJS(this.clientPath)
    this.onstatus("connecting")

    this.conn.onopen = this.onopen
    this.conn.onclose = this.onclose
  }

  connected() {
    return this.isOpen
  }

  updateStatus() {
    if (this.reconnect.reconnecting) {
      this.onstatus("reconnecting")
    } else if (this.conn === null || this.conn.readyState != SockJS.OPEN) {
      this.onstatus("disconnected")
    } else {
      this.onstatus("connected")
      this.conn.onmessage = msg => {
        this.onmessage && this.onmessage(msg)
      }
    }
  }

  reconnectReset() {
    this.reconnect.reconnecting = false
    this.reconnect.retryCurrTimeout = 0
    this.reconnect.retryCurrMultipler = 0
    this.reconnect.retryCount = 0
  }

  reconnectTry() {
    if (this.reconnect.retryCount === this.reconnect.maxRetries) {
      // Failed to reconnect n times.
      this.reconnect.reconnecting = false
      if (this.reconnect.reloadAfterN) {
        window.location.reload(true)
      }
      return
    }

    if (!this.reconnect.reconnecting) {
      // First attempt to reconnect.
      this.reconnect.reconnecting = true
      this.reconnect.retryCurrTimeout = this.reconnect.retryTimeout
      this.reconnect.retryCurrMultipler = 1
      this.reconnect.retryCount = 1
      this.connect()
    } else {
      this.reconnect.retryCount += 1
      const callback = () => {
        this.reconnect.retryCurrTimeout *= this.reconnect.retryMultiplier
        this.reconnect.retryCurrMultipler += 1
        if (this.reconnect.retryCurrMultipler === this.reconnect.resetMult) {
          this.reconnect.retryCurrTimeout = this.reconnect.retryTimeout
          this.reconnect.retryCurrMultipler = 1
        }
        this.connect()
      }
      setTimeout(callback, this.reconnect.retryCurrTimeout)
    }
  }

  send(data) {
    this.conn.send(data)
  }

  close() {
    if (this.conn) {
      this.reconnect.doNotReconnect = true
      this.conn.close()
    }
  }

  onopen = () => {
    this.reconnectReset()
    this.updateStatus()
    this.isOpen = true
  }

  onclose = () => {
    this.isOpen = false
    this.conn = null
    this.updateStatus()
    if (this.reconnect.doNotReconnect) {
      return
    }
    this.reconnectTry()
  }
}
