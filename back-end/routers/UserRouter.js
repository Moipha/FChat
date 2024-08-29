const express = require('express')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const userService = require('../services/UserService')
const verifyUtil = require('../utils/verifyUtil')
const router = express.Router()

// 注册
router.post('/', [body('email').isEmail().withMessage('无效的电子邮件地址')], async (req, res) => {
  if (!argsCheck(req, res)) return
  try {
    const newUser = await userService.registerUser(req.body)
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

// 获取用户信息
router.get('/', [query('id').isMongoId().withMessage('用户ID不合法')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const id = req.query.id
  const user = await userService.getUserById(id)
  if (user) {
    res.json({
      code: 200,
      msg: '消息获取成功',
      data: user
    })
  } else {
    res.json({
      code: 404,
      msg: '用户不存在',
      data: null
    })
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
      const { user, token } = await userService.loginUser(req.body)
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
  const friends = await userService.getFriends(userId)
  res.status(200).json({
    code: 200,
    msg: '获取好友列表成功',
    data: friends
  })
})

// 获取消息栏
router.get('/aside', async (req, res) => {
  const userId = req.userId
  const asideMessages = await userService.getAsideMessages(userId)
  res.status(200).json({
    code: 200,
    msg: '获取消息栏成功',
    data: asideMessages
  })
})

// 查询邮箱是否已被注册
router.get(
  '/email',
  [query('email').isEmail().withMessage('无效的电子邮件地址')],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    const email = req.query.email
    try {
      const user = await userService.getUserByEmail(email)
      res.status(200).json({
        code: 200,
        msg: '查询成功',
        data: user
      })
    } catch (err) {
      console.error(err)
    }
  }
)

// 发送验证邮件
router.post(
  '/send-verify',
  [body('email').isEmail().withMessage('无效的电子邮件地址')],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    // 获取目标邮箱
    const email = req.body.email
    console.log(email)
    try {
      // 生成验证码
      const verifyCode = verifyUtil.generateVerifyCode()
      // 发送邮件
      verifyUtil.sendMail(
        email,
        '验证邮件',
        `您正在注册FChat账号，验证码：${verifyCode}，五分钟内有效。请勿将验证码告知他人。`
      )
      // 将验证码保存到缓存中
      verifyUtil.storeVerifyCode(email, verifyCode, 1000 * 60 * 5)
      res.status(200).json({
        code: 200,
        msg: '邮件发送成功',
        data: null
      })
    } catch (err) {
      console.error(err)
    }
  }
)

// 校验验证码注册
router.post(
  '/verify',
  [body('email').isEmail().withMessage('无效的电子邮件地址')],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    // 获取参数
    const { email, code } = req.body
    try {
      // 校验
      const result = verifyUtil.verifyCode(email, code)
      res.json({
        code: result ? 200 : 401,
        msg: result ? '验证成功' : '验证码错误',
        data: null
      })
    } catch (err) {
      console.error(err)
    }
  }
)

// 获取该用户的所有好友申请信息
router.get('/add-list', async(req, res)=>{
  // 获取用户id
  const userId = req.userId
  const list = await userService.getAddList(userId)
  res.json({
    code: 200,
    msg: '获取好友申请列表成功',
    data: list
  })
})

module.exports = router
