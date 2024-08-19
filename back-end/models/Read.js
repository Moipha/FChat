const mongoose = require('mongoose')

/**
 * 已读回执模型
 */

const ReadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // 用户id
  friendId: { type: mongoose.Schema.Types.ObjectId, required: true }, // 好友id
  lastReadAt: { type: Date, default: () => Date.now(), required: true } // 最后一次查看消息的时间
}).index({ userId: 1, friendId: 1 })

const Read = mongoose.model('read', ReadSchema)

module.exports = Read
