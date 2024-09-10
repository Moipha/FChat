const mongoose = require('mongoose')

/**
 * 消息模型
 */

const MsgSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 发送者ID
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 接收者ID
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // 群组ID
  content: { type: String }, // 消息内容
  audio: { type: Buffer }, // 音频内容，音频消息使用
  read: [{ type: mongoose.Schema.Types.ObjectId }], // 已读用户ID
  createdTime: { type: Date, default: () => Date.now(), required: true }, // 发送时间
  type: { type: String, default: 'text', enum: ['text', 'img', 'audio', 'video'] } // 类型
}).index({ receiverId: 1, createdTime: -1 })

const Message = mongoose.model('message', MsgSchema)

module.exports = Message
