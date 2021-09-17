const _PacketCreator = '===saber==='
const _PacketVersion = '1.0.0'
const _PacketElement = 'iframe'

class WebMessage {
  _dict2json(dict) {
    if (!dict) {
      return ''
    }
    return JSON.stringify(dict)
  }

  _json2dict(json) {
    if (!json) {
      return {}
    }
    return JSON.parse(json)
  }

  _unpacketMessage(rawMessage) {
    try {
      const payload = this._json2dict(rawMessage)
      if (!payload) {
        return null
      }
      const {
        PacketCreator,
        filter,
        message
      } = payload
      if (!PacketCreator || PacketCreator !== _PacketCreator) {
        return null
      }
      const feedback = {}
      if (filter) {
        feedback['filter'] = filter
      }
      if (message) {
        feedback['message'] = message
      }
      return feedback
    } catch (e) {
      return null
    }
  }

  _packetMessage(filter, message) {
    const payload = {
      PacketCreator: _PacketCreator,
      PacketVersion: _PacketVersion
    }
    if (filter) {
      payload['filter'] = filter
    }
    if (message) {
      payload['message'] = message
    }
    return this._dict2json(payload)
  }

  post(message, filter = null, source = '*') {
    if ((window || 0).postMessage) {
      window.postMessage(this._packetMessage(filter, message), source)
    }
  }

  postToGlobal(message, filter = null, source = '*') {
    const root = (window || 0).top
    if (root) {
      root.postMessage(this._packetMessage(filter, message), source)
    }
  }

  postToParent(message, filter = null, source = '*') {
    const root = (window || 0).parent
    if (root) {
      root.postMessage(this._packetMessage(filter, message), source)
    }
  }

  postToChildren(message, filter = null, source = '*') {
    if ((document || 0).getElementsByTagName) {
      const frames = document.getElementsByTagName(_PacketElement)
      for (const index in frames) {
        const subIframe = frames[index]
        subIframe.contentWindow.postMessage(this._packetMessage(filter, message), source)
      }
    }
  }

  listener(handle, filter = null) {
    const handlerPack = (event) => {
      if (!handle) {
        return
      }
      const payload = this._unpacketMessage(event.data)
      if (!payload) {
        return
      }
      const msgFilter = payload['filter']
      if (filter && filter !== msgFilter) {
        return
      }
      handle(payload['message'], event.origin)
    }
    if ((window || 0).addEventListener) {
      window.addEventListener('message', handlerPack, false)
    } else if ((window || 0).attachEvent) {
      window.attachEvent('onmessage', handlerPack)
    }
  }
}

export default new WebMessage()
