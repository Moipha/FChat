const express = require('express')
const path = require('path')
const { PORT } = require('./config')
const db = require('./db')
const socket = require('./socket')

// 启动数据库连接
db(() => {
  // 创建服务器
  const app = express()
  // 配置静态资源路径
  app.use(express.static(path.join(__dirname, 'public')))
  // body处理中间件
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  // jwt验证中间件
  app.use(require('./middlewares/jwtMiddleware'))
  // 配置路由
  app.use('/user', require('./routers/UserRouter'))
  app.use('/msg', require('./routers/MessageRouter'))
  app.use('/friendship', require('./routers/FriendshipRouter'))
  app.use('/read', require('./routers/ReadRouter'))

  // 全局错误处理
  app.use(require('./middlewares/errorMiddleware'))

  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log('Server is running...')
  })
  // 启动socket
  socket(server)
})
