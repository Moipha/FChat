import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

/**
 * 数据处理：格式化时间
 *
 * 根据不同的时间范围格式化输入时间：
 * 1. 当天的时间显示为 'HH:mm A'，例如 '10:30 AM'
 * 2. 昨天的时间显示为 '昨天 HH:mm A'
 * 3. 本周内的其他时间显示为 '周几 HH:mm A'，例如 '周一 10:30 AM'
 * 4. 非本周的时间显示为 'YYYY/MM/DD HH:mm A'，例如 '2023/09/10 10:30 AM'
 *
 * @param {string | number | Date} time - 要格式化的时间，支持各种时间格式
 * @param {boolean} [strict=false] - 是否严格显示时间（包括时分）
 * @returns {string} 格式化后的时间字符串
 */
export function getNormal(time, strict = false) {
  if (!time) return ''

  const now = dayjs()
  const inputDate = dayjs(time)

  // 检查是否为无效日期
  if (!inputDate.isValid()) {
    return ''
  }

  // 判断是否为当天
  if (inputDate.isSame(now, 'day')) {
    // 当天的时间：HH:mm A 格式
    return inputDate.format('h:mm A')
  }

  // 判断是否为昨天
  if (inputDate.isSame(now.subtract(1, 'day'), 'day')) {
    // 昨天的时间：'昨天 HH:mm A'，根据 strict 决定是否显示时间
    return `昨天${strict ? ' ' + inputDate.format('h:mm A') : ''}`
  }

  // 计算本周的开始时间（从周一开始）
  const startOfWeek = now.startOf('week').add(1, 'day') // 设置周一为第一天
  if (inputDate.isSameOrBefore(now) && inputDate.isAfter(startOfWeek)) {
    // 本周的时间：'周几 HH:mm A'，根据 strict 决定是否显示时间
    const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][inputDate.day()]
    return `${dayOfWeek}${strict ? ' ' + inputDate.format('h:mm A') : ''}`
  }

  // 其他时间：'YYYY/MM/DD' 格式，严格模式下添加时间 'HH:mm A'
  return inputDate.format(`YYYY/MM/DD${strict ? ' h:mm A' : ''}`)
}

/**
 * 格式化时间
 *
 * 1. 一分钟以内：'刚刚'
 * 2. 1分钟到1小时：'xx分钟前'
 * 3. 1小时到今天之内：'今天 HH:mm'
 * 4. 今天之内到昨天之内：'昨天 HH:mm'
 * 5. 昨天之外到今年之内：'MM-DD'
 * 6. 今年之外: 'YYYY-MM-DD'
 */
export function getRecent(time) {
  // 检查是否为空值
  const now = dayjs()
  const inputTime = dayjs(time)

  // 检查是否为无效日期
  if (!inputTime.isValid()) {
    return '从未'
  }

  if (now.diff(inputTime, 'minute') < 1) {
    return '刚刚'
  } else if (now.diff(inputTime, 'minute') < 60) {
    return `${now.diff(inputTime, 'minute')}分钟前`
  } else if (now.isSame(inputTime, 'day')) {
    return `今天 ${inputTime.format('HH:mm')}`
  } else if (now.subtract(1, 'day').isSame(inputTime, 'day')) {
    return `昨天 ${inputTime.format('HH:mm')}`
  } else if (now.isSame(inputTime, 'year')) {
    return inputTime.format('MM-DD')
  } else {
    return inputTime.format('YYYY-MM-DD')
  }
}

export default { getNormal, getRecent }
