// FriendshipRouter.js
const express = require('express')
const { body } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const friendshipService = require('../services/FriendshipService')
const router = express.Router()

// 新建好友关系申请
router.post('/', [body('friendId').isMongoId().withMessage('目标ID不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const userId = req.userId
  const { friendId } = req.body
  try {
    const result = await friendshipService.createFriendship(userId, friendId)
    res.json(result)
  } catch (error) {
    res.status(403).json({ code: 403, msg: error.message, data: null })
  }
})

// 修改状态（同意/拒绝）
router.put(
  '/',
  [
    body('_id').isMongoId().withMessage('记录ID不合法'),
    body('status')
      .isIn(['requested', 'accepted', 'rejected'])
      .withMessage('状态必须是 requested, accepted, rejected 中的一个')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    const { status, _id } = req.body
    try {
      const result = await friendshipService.updateFriendshipStatus(_id, status)
      res.json(result)
    } catch (error) {
      res.status(404).json({ code: 404, msg: error.message, data: null })
    }
  }
)

module.exports = router
