const express = require('express')
const { body } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const UserService = require('../services/UserService')

const router = express.Router()

// 注册
router.post('/', [body('email').isEmail().withMessage('无效的电子邮件地址')], async (req, res) => {
  if (!argsCheck(req, res)) return
  try {
    const newUser = await UserService.registerUser(req.body)
    res.status(200).json({
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
  }
})

// 登录
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('无效的电子邮件地址'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    try {
      const { user, token } = await UserService.loginUser(req.body)
      res.status(200).json({
        code: 200,
        msg: '登录成功',
        data: { user, token }
      })
    } catch (err) {
      res.status(401).json({
        code: 401,
        msg: '邮箱或密码错误',
        data: null
      })
    }
  }
)

// 获取好友列表
router.get('/friends', async (req, res) => {
  const userId = req.userId
  const friends = await UserService.getFriends(userId)
  res.status(200).json({
    code: 200,
    msg: '获取好友列表成功',
    data: friends
  })
})

// 获取消息栏
router.get('/aside', async (req, res) => {
  const userId = req.userId
  const asideMessages = await UserService.getAsideMessages(userId)
  res.status(200).json({
    code: 200,
    msg: '获取消息栏成功',
    data: asideMessages
  })
})

module.exports = router
