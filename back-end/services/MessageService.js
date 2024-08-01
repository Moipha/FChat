const Message = require('../models/Message')
const User = require('../models/User')
const imgPathFix = require('../utils/imgPathFix')

// 创建新消息
async function createMessage(content, senderId, receiverId) {
  const message = await Message.create({
    content,
    receiverId,
    senderId
  })
  return message
}

// 获取两个用户之间的所有消息
async function getMessagesBetweenUsers(userId, friendId) {
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId }
    ]
  }).sort({ createdTime: 1 })

  const friend = await User.findById(friendId)
  return {
    messages,
    friend: imgPathFix(friend)
  }
}

module.exports = {
  createMessage,
  getMessagesBetweenUsers
}
