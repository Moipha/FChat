const express = require('express')
const { body } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const friendshipService = require('../services/FriendshipService')
const Result = require('../class/Result')

const router = express.Router()

// 新建好友关系申请
router.post('/', [body('friendId').isMongoId().withMessage('目标ID不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const userId = req.userId
  const { friendId } = req.body
  try {
    const result = await friendshipService.createFriendship(userId, friendId)
    res.json(Result.success(result))
  } catch (error) {
    res.status(403).json(Result.error(403, error.message))
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
      res.json(Result.success(result))
    } catch (error) {
      res.status(404).json(Result.error(404, error.message))
    }
  }
)

module.exports = router
