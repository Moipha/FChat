const express = require('express')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const messageService = require('../services/MessageService')
const Result = require('../class/Result')

const router = express.Router()

// 新建消息
router.post('/', [body('content').notEmpty().withMessage('消息内容不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const { content, receiverId } = req.body
  const senderId = req.userId
  const message = await messageService.createMessage(content, senderId, receiverId)
  res.json(Result.success(message._id, '消息保存成功'))
})

// 获取当前用户与目标用户之间的分页消息
router.get(
  '/both',
  [
    query('friendId').isMongoId().withMessage('用户ID不合法'),
    query('limit').isInt({ min: 1 }).withMessage('pageSize不合法')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    // 获取参数
    const userId = req.userId
    const friendId = req.query.friendId
    const limit = req.query.limit || 20
    const lastId = req.query.lastId
    // 获取指定页的数据
    const data = await messageService.getMsgPage(userId, friendId, limit, lastId)
    res.json(Result.success(data, '消息获取成功'))
  }
)

module.exports = router
