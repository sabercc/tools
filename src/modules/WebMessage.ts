const _PacketCreator = '===saber==='
const _PacketVersion = '1.0.0'
const _PacketElement = 'iframe'

class WebMessage {
  private _dict2json(dict: object) {
    if (!dict) {
      return ''
    }
    return JSON.stringify(dict)
  }

  private _json2dict(json: string) {
    if (!json) {
      return {}
    }
    return JSON.parse(json)
  }

  private _unpacketMessage(rawMessage: string) {
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
      const feedback: Record<string, string> = {}
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

  private _packetMessage(filter?: string, message?: string) {
    const payload: Record<string, string> = {
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

  /**
   * 向指定窗口发送消息
   * @param message - 要发送的消息
   * @param filter - 消息过滤器
   * @param source - 目标窗口的源信息，默认为 '*'
   */
  post(message: string, filter?: string, source: string = '*'): void {
    if (window.postMessage) {
      window.postMessage(this._packetMessage(filter, message), source)
    }
  }

  /**
   * 向顶层窗口发送消息
   * @param message - 要发送的消息
   * @param filter - 消息过滤器
   * @param source - 目标窗口的源信息，默认为 '*'
   */
  postToGlobal(message?: string, filter?: string, source: string = '*'): void {
    const root = (window || 0).top
    if (root) {
      root.postMessage(this._packetMessage(filter, message), source)
    }
  }

  /**
   * 向父窗口发送消息
   * @param message - 要发送的消息
   * @param filter - 消息过滤器
   * @param source - 目标窗口的源信息，默认为 '*'
   */
  postToParent(message?: string, filter?: string, source: string = '*'): void {
    const root = (window || 0).parent
    if (root) {
      root.postMessage(this._packetMessage(filter, message), source)
    }
  }

  /**
   * 向子窗口发送消息
   * @param message - 要发送的消息
   * @param filter - 消息过滤器
   * @param source - 目标窗口的源信息，默认为 '*'
   */
  postToChildren(message: string, filter: string, source: string = '*'): void {
    if (document.getElementsByTagName) {
      const frames = document.getElementsByTagName(_PacketElement)
      for (const index in frames) {
        const subIframe = frames[index]
        subIframe.contentWindow?.postMessage(this._packetMessage(filter, message), source)
      }
    }
  }

  /**
   * 监听消息事件
   * @param handle - 消息处理函数
   * @param filter - 消息过滤器
   */
  listener(handle: (message: string | null, origin: string) => void, filter: string | null = null): void {
    const handlerPack = (event: MessageEvent<any>) => {
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
    if (window.addEventListener) {
      window.addEventListener('message', handlerPack, false)
    }
  }
}

export {
  WebMessage
}