import * as WebUtils from '../core/utils/WebUtils'

export class WebEvent {
  constructor() {
    this.events = {}
  }

  /**
   * 注册事件监听
   * @memberof EventBus
   * @method bind
   * @param {string} type 事件名
   * @param {Function} cb 监听回调
   * @param {number} priority 可选入参，指定 cb 执行优先级，默认值为 0，值越大优先级越高，若值相同按监听先后顺序执行
   * @returns 无
   */
  bind(type, func, priority = 0) {
    if (WebUtils.isEmpty(type) || !WebUtils.isFunction(func)) {
      return false
    }
    if (!WebUtils.isNumber(priority) || priority < 0) {
      priority = 0
    }
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push({
      priority,
      eventCb: func
    })
    if (priority > 0) {
      // 数组按 priority 优先级从高到低重新排序
      this.events[type].sort((eventObj1, eventObj2) => eventObj1.priority < eventObj2.priority ? 1 : eventObj1.priority > eventObj2.priority ? -1 : 0)
    }
  }

  /**
   * 触发事件监听
   * @memberof EventBus
   * @method post
   * @param {string} type 事件名
   * @param {*} arg 可选入参，cb 回调入参
   * @returns 无
   */
  post(type, ...arg) {
    if (WebUtils.isEmpty(type)) {
      return false
    }
    this.events[type] && this.events[type].forEach(eventObj => {
      // 判断 this.events[type] 是因为中间某个事件绑定可能移除监听
      this.events[type] && eventObj.eventCb.call(this, ...arg)
    })
  }

  /**
   * 移除事件监听
   * @memberof EventBus
   * @method unbind
   * @param {string} type 事件名
   * @returns 无
   */
  unbind(type) {
    if (WebUtils.isEmpty(type)) {
      return false
    }
    delete this.events[type]
  }
}

export default new WebEvent()
