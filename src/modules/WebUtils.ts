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

let $lastClickTime = new Date().valueOf();

/**
 * 判断对象的原型的描述字符串
 * @private
 * @param obj - 需要判断的对象
 * @returns 函数 `_getProtoIntro` 返回string。
 * @example
 * ```ts
 * _getProtoIntro([])
 * // '[object Array]'
 * ```
 */
const _getProtoIntro = (obj: Object): typeof ARR_INTRO | typeof STR_INTRO | typeof NUM_INTRO | typeof OBJ_INTRO | typeof BLN_INTRO | typeof PMS_INTRO | typeof FUN_INTRO => {
  return Object.prototype.toString.call(obj) as typeof ARR_INTRO | typeof STR_INTRO | typeof NUM_INTRO | typeof OBJ_INTRO | typeof BLN_INTRO | typeof PMS_INTRO | typeof FUN_INTRO;
}

/**
 * 该函数检查两个对象或数组是否相等
 * @public
 * @param a - 函数的第一个参数，可以是任何数据类型。
 * @param b - `equal` 函数的第二个参数，可以是任何数据类型。它表示与第一个参数“a”进行深度相等比较的第二个值。
 * @returns 一个布尔值，指示两个输入值是否深度相等。
 */
export const equal = (a: any, b: any): boolean => {
  if (a === b) {
    return true
  }
  // Arr
  if (isArray(a)) {
    if (isArray(b) && a.length === b.length) {
      return a.every((o: any, i: number) => equal(b[i], o))
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
  return false;
}

/**
 * 合并对象/数组
 * @public
 * @param aim - 函数的第一个参数，可以是数组或对象。
 * @param src - 函数的第二个开始的参数，可以是对象或者数组。
 * @returns 与函数第一个参数相同类型，如果是对象则在原对象上增加属性，如果是数组则在原数组上增加元素。
 */
export const merge = (aim: object | any[], ...src: Array<any | object>) => {
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
                (aim as any)[key] = obj[key]
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
 * 判断是否是空
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isEmpty = (obj: any): boolean => {
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
 * 判断是否是整数类型
 * @public
 * @param obj - 任意对象
 * @param nil - 可以是0，默认是false
 * @returns boolean
 */
export const isInt = (int: any, nil = false): boolean => {
  if (Number.isNaN(int)) {
    return false
  }
  return nil ? INT_INCL0.test(int) : INT_EXCL0.test(int)
}

/**
 * 判断是否是数字类型
 * @public
 * @param num - 任意对象
 * @param nil - 不校验NaN,默认false
 * @returns boolean
 */
export const isNumber = (num: any, nan = false): boolean => {
  if (!nan && Number.isNaN(num)) {
    return false
  }
  return _getProtoIntro(num) === NUM_INTRO
}

/**
 * 判断是否是小数类型
 * @public
 * @param dec - 任意对象
 * @returns boolean
 */
export const isDecimal = (dec: any): boolean => {
  if (isNaN(dec)) {
    return false
  }
  return DEC_REGEX.test(dec)
}

/**
 * 判断是否是数组类型
 * @public
 * @param arr - 任意对象
 * @returns boolean
 */
export const isArray = (arr: any): boolean => {
  return _getProtoIntro(arr) === ARR_INTRO
}

/**
 * 判断是否是对象
 * @public
 * @param arr - 任意对象
 * @returns boolean
 */
export const isObject = (obj: any): boolean => {
  return _getProtoIntro(obj) === OBJ_INTRO && obj !== null
}

/**
 * 是否字符串
 * @public
 * @param str - 任意对象
 * @returns boolean
 */
export const isString = (str: any): boolean => {
  return _getProtoIntro(str) === STR_INTRO
}

/**
 * 是否布尔型
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isBoolean = (obj: any): boolean => {
  return _getProtoIntro(obj) === BLN_INTRO
}

/**
 * 是否定义
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isDefined = (obj: any): boolean => {
  if (isNumber(obj)) {
    return !isNaN(obj)
  }
  return !equal(obj, undefined)
}

/**
 * 是否是Promise
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isPromise = (obj: any): boolean => {
  return _getProtoIntro(obj) === PMS_INTRO
}

/**
 * 是否是方法
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isFunction = (obj: any): boolean => {
  return _getProtoIntro(obj) === FUN_INTRO
}

/**
 * 是否基本类型
 * @public
 * @param obj - 任意对象
 * @returns boolean
 */
export const isPrimitive = (obj: any) => {
  return isString(obj) || isNumber(obj) || isBoolean(obj)
}

/**
 * 是否快速点击
 * @public
 * @returns boolean
 */
export const isFastClick = () => {
  const clickTime = new Date().valueOf();
  const leaveTime = clickTime - $lastClickTime
  if (leaveTime > 0 && leaveTime < GAP_CLICK) {
    return true
  } else {
    $lastClickTime = clickTime
  }
  return false
}
