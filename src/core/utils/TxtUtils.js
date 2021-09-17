import { isEmpty, isArray, isString } from './WebUtils'

const FMT_REGEX = /\$([1-9]\d*)/g
const TXT_SPACE = /(^[\s\xa0\u3000]+)|([\s\xa0\u3000]+$)/g

/**
 * 是否空白
 *
 * @param {文本} txt
 */
export const isBlank = (txt) => {
  if (isEmpty(txt)) {
    return true
  }
  if (!isString(txt)) {
    return false
  }
  return isEmpty(trim(txt))
}

/**
 * 去除文本头尾空格
 *
 * @param {文本} txt
 */
export const trim = (txt) => {
  if (!isString(txt)) {
    return txt
  }
  return (txt || '').replace(TXT_SPACE, '')
}

/**
 * 文本格式化
 *
 * @param {文本} txt
 * @param {数组} arr
 */
export const format = (txt, arr) => {
  if (!isArray(arr)) {
    return txt
  }
  if (!isString(txt)) {
    return txt
  }
  return (txt + '').replace(FMT_REGEX, function (fmt, num) {
    return isString(fmt = arr[num - 1]) ? fmt + '' : ''
  })
}
