import {
  isEmpty,
  isObject,
  isString
} from './WebUtils'

const TROPE_KV = {
  '@': '%40',
  '\'': '%27'
}
const POUND_RP = /^#+/g
const QUERY_RP = /@|'/g
const MATCH_KV = /([^?&=]+)(?:=([^?&#]*))/g

// 匹配<prefix><query><hash>
const SLICE_URL = /([^?#]*)(\?(?:[^#]*))?(#(?:.*))?/
// 匹配<protocol>//<hostAndPort><path><query><hash>
const PARSE_URL = /^((?:[^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(\?(?:[^#]*))?(#(?:.*))?/
// 匹配Anchor
const PARSE_ANCHOR = /([^?]*)(\?.*)?/
// 匹配Host和Port
const PARSE_SERVER = /([^:]+)(?::(\d+))?/

const _qry2obj = (qry?: string, decode?: boolean) => {
  const obj: Record<string, string> = {}
  if (isString(qry) && (qry?.length ?? 0) > 0) {
    let arr
    do {
      // => ["a=1", "a", "1", index: 1, input: "?a=1&b=2", groups: undefined]
      if (!(arr = MATCH_KV.exec(qry as string))) {
        break
      }
      const [, key, val] = arr
      if (isString(key) && key.length > 0) {
        obj[key] = decode ? decodeURIComponent(val) : val
      }
    } while (true)
  }
  return obj
}

const _obj2qry = (obj?: object, encode?: boolean) => {
  if (isObject(obj)) {
    const qry = []
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        qry.push(`${key}=${encode ? encodeURIComponent((obj as any)[key]) : (obj as any)[key]}`)
      }
    }
    return qry.join('&')
  }
  return ''
}

const _mergeQuery = (newQuery?: object, oldQuery?: string, encode?: boolean) => {
  const query = isObject(newQuery) ? _obj2qry({
    ..._qry2obj(oldQuery, true),
    ...newQuery
  }, encode) : ''
  return query.length === 0 ? oldQuery : `?${
    query.replace(QUERY_RP, (i) => (TROPE_KV as any)[i] || i)
  }`
}

/**
* 拼装url
*  调用方式：UrlUtils.build(path, query, anchor).create(true|false)
* @public
* @param path - URL 的路径部分
* @param query - 查询参数对象
* @param anchor - 锚点部分
* @returns {UrlBuild} UrlBuild 实例
*/
export const build = (path: string, query: object, anchor: string) => {
  return new UrlBuild(path, query, anchor)
}

/**
 * 解析 URL 字符串并返回一个包含各个部分的对象
 * @public
 * @param url - 要解析的 URL 字符串，默认为当前页面 URL
 * @returns 解析后的 URL 信息对象
 */
export const parse = (url = ((window || 0).location || 0).href) => {
  // 相关参考：
  // https://stackoverflow.com/a/26766402/10352440
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const [, _prot = '', server = '', _path = '', query = '', anchor = ''] = (
    isString(url) && url.length > 0 ? url.match(PARSE_URL) || [] : []
  )
  const [, _hash = '', param = ''] = (
    anchor.length > 0 ? anchor.match(PARSE_ANCHOR) || [] : []
  )
  const [, _host = '', _port = ''] = (
    server.length > 0 ? server.match(PARSE_SERVER) || [] : []
  )
  return ((prot, host, port, path, hash, pathQuery, hashParam) => {
    return {
      getProtocol() {
        return prot
      },
      getHost() {
        return host
      },
      getPort() {
        return port
      },
      getPath() {
        return path
      },
      getHash() {
        return {
          route: hash,
          param: hashParam
        }
      },
      getQuery(key: string) {
        return key === undefined ? pathQuery : (
          isString(key) && key.length > 0 ? pathQuery[key] || '' : ''
        )
      }
    }
  })(_prot, _host, _port, _path, _hash, _qry2obj(query, true), _qry2obj(param, true))
}

/**
 * 拼接hash部分（Param中，新值会覆盖旧值）
 * @public
 * @param hash - string
 * @param param - object
 * @param encode - boolean
 * @returns {string} '#[<hash>][?<query>]'
 */
export const diyAnchor = (hash: string, param?: object, encode?: boolean) => {
  if (isString(hash) && hash.length > 0) {
    hash = hash.replace(POUND_RP, '')
    if (!isEmpty(param)) {
      const ask = hash.indexOf('?')
      if (ask === -1) {
        hash += _obj2qry(param, encode)
      } else {
        hash += _mergeQuery(param, hash.slice(ask), encode)
      }
    }
    return `#${hash}`
  }
  return ''
}

/**
 * UrlBuild 类用于地址操作
 */
class UrlBuild {
  private _path: string;
  private _query: object;
  private _anchor: string;

  /**
   * 创建一个 UrlBuild 实例
   * @param path - URL 的路径部分
   * @param query - 查询参数对象
   * @param anchor - 锚点部分
   */
  constructor(path: string, query: object, anchor: string) {
    this._path = path
    this._query = query
    this._anchor = anchor
  }

  /**
   * 创建完整的 URL 字符串
   * @param encode - 是否对 URL 进行编码，默认为 true
   * @returns 完整的 URL 字符串
   */
  create = (encode = true): string => {
    const [, urlPrefix = '', oldQuery = '', oldAnchor = ''] = (
      isString(this._path) && this._path.length > 0 ? this._path.match(SLICE_URL) || [] : []
    )
    // 拼接URL
    const urlQuery = _mergeQuery(
      this._query, oldQuery, encode
    )
    const urlAnchor = diyAnchor(this._anchor) || oldAnchor
    const urlResult = `${urlPrefix}${urlQuery}${urlAnchor}`
    return urlResult
  }
}
