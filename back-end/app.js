const express = require('express')
const path = require('path')

const userRouter = require('./routers/UserRouter')
const { PORT } = require('./config')
const db = require('./db')

// 启动数据库连接
db(() => {
  // 创建服务器
  const app = express()
  // 配置中间件
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  // 配置静态资源路径
  app.use(express.static(path.join(__dirname, 'public')) )
  // 配置路由
  app.use('/user', userRouter)
  // 全局错误处理
  app.use((err, req, res, next)=>{
    res.status(500).send('服务器内部错误' + err)
  })

  // 启动服务器
  app.listen(PORT, () => {
    console.log('Server is running...')
  })
})
