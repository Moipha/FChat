const Bot = require('../models/Bot')

// 创建新的ai对话
async function createBot(userId, title) {
  const bot = await Bot.create({ userId, title })
  return bot
}

// 根据id获取ai对话
async function findById(id) {
  const bot = await Bot.findById(id)
  return bot
}
// 更新对话
async function update(botId, title) {
  await Bot.updateOne({ _id: botId }, { $set: { title } })
}
// 获取用户的所有ai对话
async function findByUserId(userId) {
  const bots = await Bot.find({ userId })
  return bots
}

// 删除对话
async function deleteBot(botId) {
  await Bot.deleteOne({ _id: botId })
}

module.exports = {
  createBot,
  findById,
  update,
  findByUserId,
  deleteBot
}
