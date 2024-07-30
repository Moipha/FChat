const express = require('express')
const Message = require('../models/Message')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const router = express.Router()

// 新建消息
router.post('/', [body('content').notEmpty().withMessage('消息内容不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  // 获取参数
  const { content, receiverId } = req.body
  const senderId = req.userId
  // 保存新消息
  const message = await Message.create({
    content,
    receiverId,
    senderId
  })
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
    // 获取当前用户ID
    const id1 = req.userId
    // 获取目标用户ID
    const id2 = req.query.friendId
    // 查询消息, 按创建时间排序
    const messages = await Message.find({
      $or: [
        { senderId: id1, receiverId: id2 },
        { senderId: id2, receiverId: id1 }
      ]
    }).sort({ createdTime: -1 })

    // 添加到响应中
    res.json({
      code: 200,
      msg: '消息获取成功',
      data: messages
    })
  }
)

module.exports = router
