const Message = require('../models/Message')
const mongoose = require('mongoose')

// 创建新消息
async function createMessage(msg) {
  const message = await Message.create({ ...msg })
  return message
}

// 获取用户消息分页数据
async function getMsgPage(userId, friendId, limit, lastId) {
  // 添加查询条件：id在上一页最后一条数据id之前、发送者为当前用户或好友
  const query = {}
  if (lastId) {
    query._id = { $lt: new mongoose.Types.ObjectId(lastId) }
  }
  query.$or = [
    { senderId: userId, receiverId: friendId },
    { senderId: friendId, receiverId: userId }
  ]
  // 查询数据
  const messages = (
    await Message.find(query).limit(limit).sort({ createdTime: -1 }).lean()
  ).reverse()

  // 判断是否是最后一页
  let isLastPage = messages.length < limit
  const nextId = messages.length ? messages[0]._id : null

  // 如果没有 nextId，或者没有 lastId 并且查到的消息不足 limit，说明是最后一页
  if (!nextId || (lastId === undefined && messages.length < limit)) {
    isLastPage = true
  }

  return { messages, nextId, isLastPage }
}

// 获取分页总页数
async function getPageCount(userId, friendId) {
  const count = await Message.countDocuments({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId }
    ]
  })
  return count
}

module.exports = {
  createMessage,
  getMsgPage,
  getPageCount
}
