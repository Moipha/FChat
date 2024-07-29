const mongoose = require('mongoose')

/**
 * 群组模型
 */

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 群组名称，假设每个群组名称唯一
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 创建者ID
  leaderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 群主ID
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 群组成员列表
  description: { type: String, default: '' }, // 群组描述
  createdTime: { type: Date, default: () => Date.now(), required: true } // 群组创建时间
})

const Group = mongoose.model('Group', GroupSchema)

module.exports = Group
