/**
 * jwt 验证中间件
 */
module.exports = (req, res, next) => {
  // 如果是放行的路径和方法，则直接放行
  const pass = ['/images', '/user','/user/login',  '/user/send-verify', '/user/email', '/user/verify', '/auth/github/callback']
  if (pass.includes(req.path)) {
    return next()
  }

  const jwt = require('jsonwebtoken')
  const { SECRET_KEY } = process.env

  // 从请求头中获取JWT
  const token = req.headers['authorization']
  try {
    // 获取用户id
    const decoded = jwt.verify(token, SECRET_KEY)
    // 验证通过，将用户id保存到请求对象中
    req.userId = decoded.userId
    // 放行
    next()
  } catch (err) {
    // JWT验证失败，返回错误信息
    return res.status(401).json({
      code: 401,
      msg: 'JWT验证失败',
      data: null
    })
  }
}
