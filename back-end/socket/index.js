/**
 * 处理socket连接
 * @param {*} server
 */
const socketIo = require('socket.io')
const messageService = require('../services/MessageService')
const userService = require('../services/UserService')
const readService = require('../services/ReadService')

// 创建一个Map来存储每个用户的socket实例
const clientSockets = new Map()

module.exports = (server) => {
  // 连接socket
  const io = socketIo(server, { cors: { origin: '*' } })
  // 监听连接
  io.on('connection', (socket) => {
    // 存储当前用户id
    let uid = ''
    console.log('用户连接...')
    // 监听用户连接
    socket.on('login', async (userId) => {
      uid = userId
      // 更改数据库中你的状态
      userService.updateStatus(userId, 'online')
      // 告诉在线的好友你上线了
      const ids = await userService.getFriendIds(userId)
      ids.forEach((id) => {
        if (clientSockets.has(id.toString())) {
          clientSockets.get(id.toString()).emit(userId, 'online')
        }
      })
      // 保存当前用户的socket实例
      clientSockets.set(userId, socket)
      console.log('当前用户：', clientSockets.size)
    })

    // 接收到当前用户客户端发送的消息，将消息保存至数据库，然后发送给目标用户和当前用户的客户端
    socket.on('chat', async (msg) => {
      // 保存消息至数据库
      const savedMsg = await messageService.createMessage(msg)
      // 发送给当前用户
      socket.emit('callback-msg', savedMsg)
      // 发送给目标用户
      if (clientSockets.has(msg.receiverId)) {
        clientSockets.get(msg.receiverId).emit('receive-msg', savedMsg)
      }
    })

    // 更新已读回执
    socket.on('save-read', async ([userId, friendId]) => {
      // 确定已读时间
      const time = new Date()
      // 更新回执
      await readService.updateRead(userId, friendId, time)
      // 如果朋友在线，通知其我已读
      if (clientSockets.has(friendId)) {
        clientSockets.get(friendId).emit('read', time)
      }
    })

    // 断开连接
    socket.on('disconnect', async () => {
      console.log('用户断开连接...')
      // 更改数据库中你的状态
      if (uid == '') {
        return
      }
      userService.updateStatus(uid, 'offline')
      // 告诉在线的好友你下线了
      const ids = await userService.getFriendIds(uid)
      ids.forEach((id) => {
        if (clientSockets.has(id.toString())) {
          clientSockets.get(id.toString()).emit(uid, 'offline')
        }
      })
      // 清理存储的用户socket实例
      clientSockets.delete(uid)
      console.log('当前用户：', clientSockets.size)
    })
  })
}
