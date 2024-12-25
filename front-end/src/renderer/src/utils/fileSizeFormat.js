/**
 * 格式化文件大小
 */
export default function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const k = 1024
  const decimalPlaces = 2 // 保留小数位数

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)

  return `${size.toFixed(size < 10 && i > 0 ? decimalPlaces : 0)} ${units[i]}`
}
