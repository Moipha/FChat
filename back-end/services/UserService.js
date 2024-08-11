const User = require('../models/User')
const Friendship = require('../models/Friendship')
const Message = require('../models/Message')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const imgPathFix = require('../utils/imgPathFix')

/**
 * 注册新用户
 * @param {Object} userInfo 用户信息
 * @returns {Promise<Object>} 新用户对象
 */
async function registerUser(userInfo) {
  const newUser = await User.create(userInfo)
  return newUser
}

/**
 * 用户登录
 * @param {Object} loginInfo 登录信息
 * @returns {Promise<Object>} 用户信息和token
 */
async function loginUser(loginInfo) {
  const user = await User.findOne(loginInfo)
  if (!user) {
    throw new Error('用户不存在')
  }
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '24h' })
  // 更改数据库中的状态
  // await updateStatus(user._id, 'online')
  user.status = 'online'
  return { user: imgPathFix(user), token }
}

/**
 * 获取用户的好友列表
 * @param {import('mongoose').ObjectId} userId 用户ID
 * @returns {Promise<Array>} 好友列表
 */
async function getFriends(userId) {
  const ids = await getFriendIds(userId)
  return await User.find({ _id: { $in: ids } })
}

/**
 * 获取用户的好友id列表
 * @param {import('mongoose').ObjectId} userId 用户ID
 * @returns {[import('mongoose').ObjectId]} 好友id列表
 */
async function getFriendIds(userId) {
  // 获取已通过、且当前用户是申请人或被申请人的申请记录
  const records = await Friendship.find({
    $or: [
      { userId, status: 'accepted' },
      { friendId: userId, status: 'accepted' }
    ]
  })
  // 获取好友的id数组
  return records.map((record) => (record.userId == userId ? record.friendId : record.userId))
}

/**
 * 获取用户的消息栏
 * @param {import('mongoose').ObjectId} userId 用户ID
 * @returns {Promise<Array>} 消息栏数据
 */
async function getAsideMessages(userId) {
  const friends = await getFriends(userId)
  const ans = []
  for (const friend of imgPathFix(friends)) {
    // 获取最后一条消息
    const msg = await Message.findOne({
      $or: [
        { senderId: userId, receiverId: friend._id },
        { senderId: friend._id, receiverId: userId }
      ]
    })
      .sort({ createdTime: -1 })
      .limit(1)
    ans.push({
      id: friend._id,
      name: friend.username,
      avatar: friend.avatar,
      msg: msg && msg.content,
      createdTime: msg && msg.createdTime
    })
  }
  ans.sort((a, b) => b.createdTime - a.createdTime)
  return ans
}

/**
 * 修改登录状态
 * @param {string} userId 用户id
 * @param {enum} status 目标状态
 */
async function updateStatus(userId, status) {
  // 检验参数是否合法
  if (['online', 'offline', 'away', 'busy'].indexOf(status) === -1) {
    throw new Error('状态错误')
  }
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('用户不存在')
  }
  // 更新状态
  await User.updateOne({ _id: userId }, { status })
}

// 获取指定用户的信息
async function getUserById(id) {
  const user = await User.findById(id)
  return imgPathFix(user)
}

module.exports = {
  registerUser,
  loginUser,
  getFriends,
  getFriendIds,
  getAsideMessages,
  updateStatus,
  getUserById
}
