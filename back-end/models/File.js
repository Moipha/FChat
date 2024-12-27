const mongoose = require('mongoose')

/**
 * 文件模型
 */

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 文件名
  path: { type: String, required: true }, // 存储路径
  size: { type: Number, required: true }, // 文件大小
  type: { type: String, required: true }, // 文件类型
  uploadedAt: { type: Date, default: () => Date.now(), required: true } // 上传时间
})

const File = mongoose.model('file', FileSchema)

module.exports = File
