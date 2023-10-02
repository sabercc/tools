import { isArray } from './WebUtils'

const ENV_LHIP = ['127.0.0.1', 'localhost', '::1']

/**
 * 判断ip地址是否是本地
 * @public
 * @param list - 需要判断的是否是localhost的数组
 * @param host - 域名，如果未传，默认是当前网址的域名。
 * @returns 函数 `isLocalhost` 返回boolean判断是否是本地域名。
 * @example
 * ```ts
 * isLocalhost(['192.168.0.102'])
 * // true
 * ```
 */
export const isLocalhost = (list: string[] = [], host: string = ((window || 0).location || 0).hostname): boolean => {
  return ENV_LHIP.indexOf(host) !== -1 || (
    isArray(list) && list.length > 0 ? list.indexOf(host) !== -1 : false
  )
}
