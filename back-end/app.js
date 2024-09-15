// 加载环境变量
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}`})
// require('dotenv').config({ path: './.env.development'})

const express = require('express')
const path = require('path')
const db = require('./db')
const socket = require('./socket')
const cors = require('cors')
const {PORT} = process.env

// 启动数据库连接
db(() => {
  // 创建服务器
  const app = express()
  // 配置跨域
  app.use(cors())
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
    console.log(`Node 服务已在 ${PORT} 端口上运行`)
  })
  // 启动socket
  socket(server)
})
