const File = require('../models/File')

// 保存文件信息
async function createFile(file) {
  return await File.create(file)
}

// 保存文件到磁盘
async function saveFile(file) {
  const filePath = `uploads${Date.now()}_${file.name}`
  const buffer = Buffer.from(file.data, 'base64')
  await fs.promises.writeFile(filePath, buffer)
  return filePath
}

// 通知客户端
async function notifyClient({ receiverId, senderId, message, savedFile }) {
  const { clientSockets } = require('../socket')
  const data = {
    _id: message._id,
    senderId: message.senderId,
    receiverId: message.receiverId,
    read: message.read,
    type: message.type,
    createdTime: message.createdTime,
    file: savedFile
  }
  // 如果好友在线，发送文件消息
  if (clientSockets.has(receiverId)) {
    clientSockets.get(receiverId).emit('receive-msg', data)
  }
  // 发送消息给当前用户
  if (clientSockets.has(senderId)) {
    clientSockets.get(senderId).emit('callback-msg', data)
  }
}

module.exports = {
  createFile,
  saveFile,
  notifyClient
}
