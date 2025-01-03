const mongoose = require('mongoose')

/**
 * ai聊天模型
 */

const BotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 聊天用户ID
  title: { type: String, required: true }, // 聊天标题
  createdTime: { type: Date, default: () => Date.now(), required: true } // 创建时间
}).index({ createdTime: -1 })

const Bot = mongoose.model('bot', BotSchema)

module.exports = Bot
