const GAP_CLICK = 700
const ARR_INTRO = '[object Array]'
const STR_INTRO = '[object String]'
const NUM_INTRO = '[object Number]'
const OBJ_INTRO = '[object Object]'
const BLN_INTRO = '[object Boolean]'
const PMS_INTRO = '[object Promise]'
const FUN_INTRO = '[object Function]'
const INT_INCL0 = /^[+-]?\d+(e+[1-9]\d*)?$/i
const INT_EXCL0 = /^[+-]?[1-9]\d*(e+[1-9]\d*)?$/i
const DEC_REGEX = /^[+-]?\d+(\.\d*(e-[1-9]\d*)?|e-[1-9]\d*)$/i

let $lastClickTime = new Date()

const _getProtoIntro = (obj) => {
  return Object.prototype.toString.call(obj)
}

/**
 * 比较对象相等
 *
 * @param {对象} a
 * @param {对象} b
 */
export const equal = (a, b) => {
  // Arr
  if (isArray(a)) {
    if (isArray(b) && a.length === b.length) {
      return a.every((o, i) => equal(b[i], o))
    }
    return false
  }
  // Obj
  if (isObject(a)) {
    if (isObject(b)) {
      const k = Object.keys(a)
      if (Object.keys(b).length === k.length) {
        return k.every((t) => equal(a[t], b[t]))
      }
    }
    return false
  }
  return a === b
}

/**
 * 合并对象
 * @param {目标} aim
 * @param  {...对象} src
 */
export const merge = (aim, ...src) => {
  if (aim == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  const l = src.length
  if (l > 0) {
    switch (_getProtoIntro(aim)) {
      case OBJ_INTRO: {
        for (let i = 0; i < l; i++) {
          const obj = src[i]
          if (isObject(obj)) {
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                aim[key] = obj[key]
              }
            }
          }
        }
        break
      }
      case ARR_INTRO: {
        for (let i = 0; i < l; i++) {
          const arr = src[i]
          if (isArray(arr) && arr.length > 0) {
            Array.prototype.concat.apply(aim, arr)
          }
        }
        break
      }
    }
  }
  return aim
}

/**
 * 是否为空
 *
 * @param {对象} obj
 */
export const isEmpty = (obj) => {
  if (obj == null) {
    return true
  } else {
    switch (_getProtoIntro(obj)) {
      case NUM_INTRO: {
        return isNaN(obj)
      }
      case STR_INTRO:
      case ARR_INTRO: {
        return obj.length === 0
      }
    }
  }
  return false
}

/**
 * 是否整数
 *
 * @param {整数} int
 */
export const isInt = (int, nil = false) => {
  if (isNaN(int)) {
    return false
  }
  return nil ? INT_INCL0.test(int) : INT_EXCL0.test(int)
}

/**
 * 是否数字
 *
 * @param {数字} num
 */
export const isNumber = (num, nan = false) => {
  if (!nan && isNaN(num)) {
    return false
  }
  return _getProtoIntro(num) === NUM_INTRO
}

/**
 * 是否小数
 *
 * @param {小数} dec
 */
export const isDecimal = (dec) => {
  if (isNaN(dec)) {
    return false
  }
  return DEC_REGEX.test(dec)
}

/**
 * 是否数组
 *
 * @param {数组} arr
 */
export const isArray = (arr) => {
  return _getProtoIntro(arr) === ARR_INTRO
}

/**
 * 是否对象
 *
 * @param {对象} obj
 */
export const isObject = (obj) => {
  return _getProtoIntro(obj) === OBJ_INTRO && obj !== null
}

/**
 * 是否字符串
 *
 * @param {字符} str
 */
export const isString = (str) => {
  return _getProtoIntro(str) === STR_INTRO
}

/**
 * 是否布尔型
 *
 * @param {对象} obj
 */
export const isBoolean = (obj) => {
  return _getProtoIntro(obj) === BLN_INTRO
}

/**
 * 是否定义
 *
 * @param {对象} obj
 */
export const isDefined = (obj) => {
  if (isNumber(obj)) {
    return !isNaN(obj)
  }
  return !equal(obj, undefined)
}

/**
 * 是否期望
 *
 * @param {对象} obj
 */
export const isPromise = (obj) => {
  return _getProtoIntro(obj) === PMS_INTRO
}

/**
 * 是否函数
 *
 * @param {对象} obj
 */
export const isFunction = (obj) => {
  return _getProtoIntro(obj) === FUN_INTRO
}

/**
 * 是否基本类型
 *
 * @param {对象} obj
 */
export const isPrimitive = (obj) => {
  return isString(obj) || isNumber(obj) || isBoolean(obj)
}

/**
 * 是否快速点击
 */
export const isFastClick = () => {
  const clickTime = new Date()
  const leaveTime = clickTime - $lastClickTime
  if (leaveTime > 0 && leaveTime < GAP_CLICK) {
    return true
  } else {
    $lastClickTime = clickTime
  }
  return false
}
