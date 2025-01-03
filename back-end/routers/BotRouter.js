const express = require('express')
const { body, query } = require('express-validator')
const argsCheck = require('../utils/argsCheck')
const Message = require('../models/Message')
const Bot = require('../models/Bot')
const botService = require('../services/BotService')
const messageService = require('../services/MessageService')
const Result = require('../class/Result')
const router = express.Router()

// 开启新的对话
router.post('/', [body('title').notEmpty().withMessage('对话标题不能为空')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const { title } = req.body
  const userId = req.userId
  const bot = await botService.createBot(userId, title)
  res.status(200).json(Result.success(bot, '创建对话成功'))
})

// 保存ai对话消息
router.post(
  '/msg',
  [
    body('content').notEmpty().withMessage('消息内容不能为空'),
    body('botId').isMongoId().withMessage('对话id不合法')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    const { content, botId, senderId, receiverId } = req.body
    await messageService.createBotMsg(botId, senderId, content, receiverId)
    res.status(200).json(Result.success('消息保存成功'))
  }
)

// 根据id获取某个对话的分页消息列表
router.get(
  '/page',
  [
    query('botId').notEmpty().withMessage('对话id不能为空'),
    query('limit').isInt({ min: 1 }).withMessage('pageSize不合法')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    // 获取参数
    const userId = req.userId
    const botId = req.query.botId
    const limit = req.query.limit || 20
    const lastId = req.query.lastId
    // 获取指定页的数据
    const data = await messageService.getBotMsgPage(userId, botId, limit, lastId)
    res.json(Result.success(data, '消息获取成功'))
  }
)

// 获取bot相关信息
router.get('/', [query('botId').isMongoId().withMessage('对话ID不合法')], async (req, res) => {
  if (!argsCheck(req, res)) return
  const botId = req.query.botId
  const bot = await botService.findById(botId)
  res.json(Result.success(bot, '获取对话信息成功'))
})

// 更新bot标题
router.put(
  '/',
  [
    body('botId').isMongoId().withMessage('对话ID不合法'),
    body('title').notEmpty().withMessage('标题不能为空')
  ],
  async (req, res) => {
    if (!argsCheck(req, res)) return
    const { botId, title } = req.body
    await botService.update(botId, title)
    res.json(Result.success('对话更新成功'))
  }
)

// 获取当前用户的所有ai对话
router.get('/list', async (req, res) => {
  const userId = req.userId
  const bots = await botService.findByUserId(userId)
  res.json(Result.success(bots, '获取对话列表成功'))
})

module.exports = router
