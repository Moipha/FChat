const Friendship = require('../models/Friendship')

// 新建好友关系申请
async function createFriendship(userId, friendId, content) {
  const friendship = await Friendship.findOne({ friendId, userId })
  if (friendship && friendship.status !== 'rejected') {
    throw new Error('重复的好友请求')
  }
  await Friendship.create({ friendId, userId, content })
  return {
    code: 200,
    msg: '请求保存成功',
    data: null
  }
}

// 修改好友关系状态
async function updateFriendshipStatus(_id, status) {
  const friendship = await Friendship.findById(_id)
  if (!friendship) {
    throw new Error('未找到对应的Friendship记录')
  }
  friendship.status = status
  await friendship.save()
  return {
    code: 200,
    msg: '状态更新成功',
    data: `状态已更新为${status}`
  }
}

module.exports = {
  createFriendship,
  updateFriendshipStatus
}
