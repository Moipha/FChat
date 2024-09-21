const mongoose = require('mongoose')

/**
 * 用户模型
 */

// 创建文档结构
const UserSchema = new mongoose.Schema({
  username: { type: String, default: '匿名用户' }, // 用户名
  password: { type: String }, // 密码
  email: { type: String, unique: true }, // 邮箱
  avatar: { type: String, default: '/images/default.jpg' }, // 头像
  githubId: { type: Number, unique: true }, // github授权登录唯一标识
  status: { type: String, enum: ['online', 'offline', 'away', 'busy'], default: 'offline' }, // 状态
  createdTime: { type: Date, default: () => Date.now(), required: true } // 创建时间
}).index({ email: 1 ,unique: true})

// 创建文档模型
const User = mongoose.model('user', UserSchema)

module.exports = User
