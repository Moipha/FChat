module.exports = (success, error) => {
  const mongoose = require('mongoose')
  const { DB_HOST, DB_PORT, DB_NAME } = require('../config')

  if (typeof error !== 'function') {
    error = () => {
      console.log('数据库连接失败...')
    }
  }
  // 连接数据库
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  

  // 生命周期
  mongoose.connection.once('open', () => {
    console.log('数据库连接成功...')
    success()
  })
  mongoose.connection.on('error', () => {
    error()
  })
  mongoose.connection.on('close', () => {
    console.log('数据库连接已断开...')
  })
}
