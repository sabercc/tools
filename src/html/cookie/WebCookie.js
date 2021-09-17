import * as WebUtils from '../../core/utils/WebUtils'

const EQ_SYMBOL = '='
const SP_COOKIE = '; '
const RP_DECODE = /(%[0-9A-Z]{2})+/g

const DecCookie = (str) => {
  return str.replace(RP_DECODE, decodeURIComponent)
}

class WebCookie {
  get(key) {
    const cookies = {}
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

export default new WebCookie()
