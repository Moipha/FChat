const express = require('express')
const Friendship = require('../models/Friendship')
const { body } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const router = express.Router()

// 新建好友关系申请
router.post('/', [body('friendId').isMongoId().withMessage('目标ID不能为空')], async (req, res) => {
  // 参数校验
  if (!argsCheck(req, res)) return
  // 获取参数
  const userId = req.userId
  const { friendId } = req.body
  // 查重
  const friendship = await Friendship.findOne({ friendId, userId })
  if (friendship && friendship.status !== 'rejected') {
    return res.status(403).json({ code: 403, msg: '重复的好友请求', data: null })
  }
  // 保存好友关系
  await Friendship.create({ friendId, userId })
  res.json({
    code: 200,
    msg: '请求保存成功',
    data: null
  })
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
    // 获取该条请求记录
    const { status, _id } = req.body
    const friendship = await Friendship.findById(_id)
    if (!friendship) {
      return res.status(404).json({ code: 404, msg: '未找到对应的Friendship记录' })
    }
    // 更新状态
    friendship.status = status
    await friendship.save()
    // 响应成功
    res.json({
      code: 200,
      msg: '状态更新成功',
      data: `状态已更新为${status}`
    })
  }
)

module.exports = router
