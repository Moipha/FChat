const express = require('express')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const messageService = require('../services/MessageService')

const router = express.Router()

// 新建消息
router.post('/', [body('content').notEmpty().withMessage('消息内容不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const { content, receiverId } = req.body
  const senderId = req.userId
  const message = await messageService.createMessage(content, senderId, receiverId)
  res.json({
    code: 200,
    msg: '消息保存成功',
    data: message._id
  })
})

// 获取当前用户与目标用户之间的所有消息
router.get(
  '/both',
  [query('friendId').isMongoId().withMessage('用户ID不合法')],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    const userId = req.userId
    const friendId = req.query.friendId
    const { messages, friend } = await messageService.getMessagesBetweenUsers(userId, friendId)
    res.json({
      code: 200,
      msg: '消息获取成功',
      data: { messages, friend }
    })
  }
)

module.exports = router
