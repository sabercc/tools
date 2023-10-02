import * as WebUtils from './WebUtils'

const EQ_SYMBOL = '='
const SP_COOKIE = '; '
const RP_DECODE = /(%[0-9A-Z]{2})+/g

/**
 * 解码带有百分号编码的字符串
 * @public
 * @param str - 需要解码的字符串
 * @returns 解码后的字符串
 */
const DecCookie = (str: string) => {
  return str.replace(RP_DECODE, decodeURIComponent)
}

/**
 * WebCookie 类用于操作浏览器中的 Cookie。
 */
class WebCookie {
  /**
   * 获取指定 Cookie 的值
   * @param key - Cookie 名称
   * @returns Cookie 的值，如果不存在则返回 undefined
   */
  get(key: string) {
    const cookies: Record<string, string> = {}
    const content = (document || 0).cookie
    if (WebUtils.isString(content) && content.length > 0) {
      const section = content.split(SP_COOKIE)
      for (let l = section.length, i = 0, cut, val, tag; i < l; i++) {
        val = DecCookie((cut = section[i].split(EQ_SYMBOL)).slice(1).join(EQ_SYMBOL))
        try {
          cookies[tag = DecCookie(cut[0])] = val
          if (key === tag) {
            return val
          }
        } catch (e) {}
      }
    }
    return WebUtils.isString(key) ? cookies[key] : cookies
  }
}

export {
  DecCookie,
  WebCookie
}