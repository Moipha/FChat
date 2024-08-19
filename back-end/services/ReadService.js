const Read = require('../models/Read')

// 新建已读回执
async function createRead(userId, friendId, time) {
  await Read.create({ userId, friendId, lastReadAt: time })
}

// 更新已读回执，没有则自动创建
async function updateRead(userId, friendId, time) {
  // upsert为true会在找不到记录时创建新记录
  await Read.updateOne(
    { userId, friendId },
    { $set: { lastReadAt: time } },
    { upsert: true }
  )
}

// 获取指定回执的最后阅读时间
async function getLastReadAt(userId, friendId) {
  const read = await Read.findOne({ userId, friendId })
  if (read) {
    return read.lastReadAt
  } else {
    throw new Error('没有该回执')
  }
}

module.exports = {
  createRead,
  updateRead,
  getLastReadAt
}
