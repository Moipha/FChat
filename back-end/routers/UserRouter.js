const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

const router = express.Router()

router.post(
  '/',
  [
    body('email').isEmail().withMessage('无效的电子邮件地址')
  ],
  async (req, res) => {
    // 参数校验
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        msg: '不合法的Body参数',
        errors: errors.array()
      })
    }
    // 保存用户
    try {
      const newUser = await User.create({ ...req.body })
      res.json({
        code: 200,
        msg: '用户创建成功',
        data: newUser
      })
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          code: 400,
          msg: '该邮件已被注册',
          data: null
        })
      }
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null
      })
      console.error(err)
    }
  }
)

module.exports = router
