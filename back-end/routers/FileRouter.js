const express = require('express')
const multer = require('multer')
const argsCheck = require('../utils/argsCheck')
const File = require('../models/File')
const Message = require('../models/Message')
const fileService = require('../services/FileService')
const messageService = require('../services/MessageService')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// 配置 multer 保存路径
const upload = multer({ dest: 'uploads/' })

// 上传文件接口
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!argsCheck(req, res)) return
  try {
    const file = req.file // multer 提供的文件信息
    const { senderId, receiverId } = req.body // 从表单中获取额外信息

    // 保存文件信息到数据库
    const savedFile = await fileService.createFile({
      name: file.originalname,
      path: file.path,
      size: file.size,
      type: file.mimetype
    })

    // 创建消息
    const message = await messageService.createMessage({
      senderId,
      receiverId,
      type: 'file',
      file: savedFile._id // 关联文件
    })

    // 通知 socket 服务
    fileService.notifyClient({ receiverId, senderId, message, savedFile })

    res.status(200).json({ message: '文件上传成功', data: { ...message, file: savedFile } })
  } catch (error) {
    console.error('文件上传失败：', error)
    res.status(500).json({ message: '文件上传失败', error })
  }
})

// 下载文件
router.get('/uploads/:filePath', async (req, res) => {
  try {
    const { filePath } = req.params
    const fullPath = path.resolve(__dirname, '..', 'uploads', filePath) // 组合成绝对路径

    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: '文件不存在' })
    }

    // 设置响应头并返回文件
    res.download(fullPath, (err) => {
      if (err) {
        console.error('文件下载出错：', err)
        res.status(500).json({ message: '文件下载失败' })
      }
    })
  } catch (error) {
    console.error('文件下载失败：', error)
    res.status(500).json({ message: '文件下载失败', error })
  }
})

module.exports = router
