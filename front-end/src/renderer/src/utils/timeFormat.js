// 数据处理：格式化时间
export default function timeFormat(time) {
  const now = new Date()
  const inputDate = new Date(time)

  // 1. 当天的时间格式化为 HH:mm AM/PM
  function formatTimeAs12Hour(date) {
    const hours = date.getHours() % 12 || 12 // 转换为12小时制，并处理0小时的情况
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const period = date.getHours() < 12 ? 'AM' : 'PM'
    return `${hours}:${minutes} ${period}`
  }

  // 获取两个日期之间的天数差
  function getDaysDiff(d1, d2) {
    const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate())
    const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate())
    // 计算日期差（以天为单位）
    const diff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24))
    return diff
  }

  // 获取一周中的第几天
  function getDayOfWeek(dayNum) {
    const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[dayNum]
  }

  // 格式化日期为 YY/MM/DD
  function formatDateAsYYMMDD(date) {
    const year = String(date.getFullYear()).slice(-2)
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    return `${year}/${month}/${day}`
  }

  // 判断并返回对应格式的字符串
  if (inputDate.toDateString() === now.toDateString()) {
    // 1. 当天的时间
    return formatTimeAs12Hour(inputDate)
  } else if (getDaysDiff(now, inputDate) === 1) {
    // 2. 昨天的时间
    return '昨天'
  } else {
    // 将周日由0处理为7
    const curDay = now.getDay() || 7
    const inputDay = inputDate.getDay() || 7
    if (inputDay < curDay) {
      // 3. 本周的时间
      return getDayOfWeek(inputDay)
    } else {
      // 4. 非本周的时间
      return formatDateAsYYMMDD(inputDate)
    }
  }
}
