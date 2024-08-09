/**
 * 节流函数
 * @param {Function} func
 * @param {Number} limit
 * @returns
 */
export default function throttle(func, limit) {
  let lastRan
  return function () {
    const context = this
    const args = arguments
    const now = Date.now()
    if (!lastRan || now - lastRan >= limit) {
      // 如果这是第一次调用，或者距离上次调用已经超过了limit时间，则执行函数
      func.apply(context, args)
      lastRan = now // 更新最后执行时间
    }
  }
}
