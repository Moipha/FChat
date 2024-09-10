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
  const friends = await User.find({ _id: { $in: ids } })
  return imgPathFix(friends)
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
  for (const friend of friends) {
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
      type: msg && msg.type,
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
  if (userId === '') {
    throw new Error('ID为空')
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
  if (user) {
    return imgPathFix(user)
  } else {
    return null
  }
}

// 根据邮箱查询用户
async function getUserByEmail(email) {
  const user = await User.findOne({ email })
  if (user) return imgPathFix(user)
  return null
}

// 获取用户的好友申请信息
async function getAddList(userId) {
  const records = await Friendship.find({
    $or: [{ userId }, { friendId: userId }]
  })
  // 将id替换成用户对象
  const res = []
  for (const record of records) {
    // 判断当前用户是否是请求者
    const isReq = record.userId == userId
    // 浅拷贝
    const temp = JSON.parse(JSON.stringify(record))
    // 获取朋友的信息
    const user = await User.findById(isReq ? record.friendId : record.userId)
    temp[isReq ? 'friend' : 'user'] = imgPathFix(user)
    res.push(temp)
  }
  return res
}

// 根据邮箱或用户名获取用户
async function search(keyword) {
  const regex = new RegExp(keyword, 'i')
  const result = await User.find({
    $or: [{ email: regex }, { username: regex }]
  })
  return imgPathFix(result)
}

module.exports = {
  registerUser,
  loginUser,
  getFriends,
  getFriendIds,
  getAsideMessages,
  updateStatus,
  getUserById,
  getUserByEmail,
  getAddList,
  search
}
