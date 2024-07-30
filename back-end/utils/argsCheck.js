/**
 * 请求参数校验
 */

module.exports = (req, res) => {
  const { validationResult } = require('express-validator')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 400,
      msg: '不合法的Body参数',
      data: errors.array()
    })
    return false
  }
  return true
}
