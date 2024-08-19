const express = require('express')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const readService = require('../services/ReadService')

const router = express.Router()

// 添加/更新已读回执
router.post(
  '/',
  [
    body('friendId').isMongoId().withMessage('好友id不合法'),
    body('time').isISO8601().withMessage('读取时间不合法')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    // 接收参数
    const { friendId, time } = req.body
    const userId = req.userId
    // 更新或新建已读回执
    await readService.updateRead(userId, friendId, time)
    res.status(200).json({
      code: 200,
      msg: '操作成功',
      data: null
    })
  }
)

// 查询朋友已读当前用户的最新时间
router.get('/', [query('friendId').isMongoId().withMessage('传入ID不合法')], async (req, res) => {
  if (!argsCheck(req, res)) return
  try {
    // 获取参数
    const { friendId } = req.query
    const userId = req.userId
    const time = await readService.getLastReadAt(friendId, userId)
    res.json({
      code: 200,
      msg: '时间获取成功',
      data: time
    })
  } catch (e) {
    res.json({
      code: 400,
      msg: '传入参数有误',
      data: e.message
    })
  }
})

module.exports = router
