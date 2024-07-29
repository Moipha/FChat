const mongoose = require('mongoose')

/**
 * 用户模型
 */

// 创建文档结构
const UserSchema = new mongoose.Schema({
  username: { type: String, default: '匿名用户' }, // 用户名
  password: { type: String, required: true }, // 密码
  email: { type: String, required: true, unique: true }, // 邮箱
  avatar: { type: String, default: '/images/default.jpg' }, // 头像
  status: { type: String, enum: ['online', 'offline', 'away', 'busy'], default: 'offline' }, // 状态
  createdTime: { type: Date, default: () => Date.now(), required: true } // 创建时间
})

// 创建文档模型
const User = mongoose.model('user', UserSchema)

module.exports = User
