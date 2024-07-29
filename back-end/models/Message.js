const mongoose = require('mongoose')

/**
 * 消息模型
 */

const MsgSchema = new mongoose.Schema({
  senderId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // 发送者ID
  receiverId: { type: mongoose.Types.ObjectId, ref: 'User' }, // 接收者ID
  groupId: { type: mongoose.Types.ObjectId, ref: 'Group' }, // 群组ID
  content: { type: String, required: true }, // 消息内容
  read: [{ type: mongoose.Types.ObjectId }], // 已读用户ID
  createdTime: { type: Date, default: () => Date.now(), required: true } // 发送时间
})

const Message = mongoose.model('message', MsgSchema)

module.exports = Message
