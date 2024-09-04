/**
 * 防抖函数
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
export default function debounce(func, delay) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    // 每次调用时都清除之前的定时器
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}
