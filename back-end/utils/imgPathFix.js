/**
 * 处理用户的图片路径
 * @param {*} user 用户模型或用户列表
 * @returns 处理后的模型或模型列表
 */
module.exports = (user) => {
  const { PROTOCOL, IP, PORT } = process.env
  // 如果为数组，则遍历处理
  if (user instanceof Array) {
    const res = []
    user.forEach((item) => {
      res.push(fixPath(item))
    })
    return res
  } else {
    return fixPath(user)
  }
  function fixPath(user) {
    if (!user) return user
    if (!user.avatar) return user
    if (!user.avatar.startsWith('http')) {
      if (user.avatar.startsWith('default:')) {
        user.avatar = user.avatar.slice(9)
      } else {
        user.avatar = `${PROTOCOL}://${IP}:${PORT}${user.avatar}`
      }
    }
    return user
  }
}
