const mongoose = require('mongoose')

/**
 * 好友关系模型
 */

const FriendshipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 用户ID，发起好友请求的用户
  friendId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 好友ID，被请求成为好友的用户
  status: { type: String, enum: ['requested', 'accepted', 'rejected'], default: 'requested' }, // 好友关系状态
  createdTime: { type: Date, default: () => Date.now(), required: true } // 关系创建时间
})

const Friendship = mongoose.model('Friendship', FriendshipSchema)

module.exports = Friendship
