const express = require('express')
const User = require('../models/User')
const Friendship = require('../models/Friendship')
const { body } = require('express-validator')
const { SECRET_KEY } = require('../config')
const jwt = require('jsonwebtoken')
const argsCheck = require('../utils/argsCheck')
const imgPathFix = require('../utils/imgPathFix')

const router = express.Router()

// 注册
router.post('/', [body('email').isEmail().withMessage('无效的电子邮件地址')], async (req, res) => {
  // 参数校验
  if (!argsCheck(req, res)) return
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
    // 参数校验
    if (!argsCheck(req, res)) return
    // 查询用户
    const user = await User.findOne({ ...req.body })
    // 判断查询结果
    if (user === null) {
      return res.status(401).json({
        code: 401,
        msg: '邮箱或密码错误',
        data: null
      })
    }
    // 设置token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' })
    // 返回token
    res.json({
      code: 200,
      msg: '登录成功',
      data: { user: imgPathFix(user), token }
    })
  }
)

// 获取好友列表
router.get('/friends', async (req, res) => {
  // 参数校验
  const userId = req.userId
  // 查询用户
  const user = await User.findById(userId)
  // 判断查询结果
  if (user === null) {
    return res.status(410).json({
      code: 410,
      msg: '当前用户已被意外删除',
      data: null
    })
  }
  // 获取当前用户相关的好友申请记录
  const records = await Friendship.find({
    $or: [
      { userId, status: 'accepted' },
      { friendId: userId, status: 'accepted' }
    ]
  })
  // 获取用户的好友id
  const ids = []
  for (const record of records) {
    // 获取好友id
    if (record.userId === userId) {
      ids.push(record.friendId)
    } else {
      ids.push(record.userId)
    }
  }
  // 获取好友模型集合
  const friends = await User.find({ _id: { $in: ids } })

  // 返回响应
  res.status(200).json({
    code: 200,
    msg: '获取好友列表成功',
    data: imgPathFix(friends)
  })
})

module.exports = router
