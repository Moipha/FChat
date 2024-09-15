const nodemailer = require('nodemailer')
const { MAIL_HOST, MAIL_PASS, MAIL_USER, MAIL_PORT } = process.env

// 配置项
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
})

// 发送邮件
function sendMail(to, subject, text) {
  // 设置邮件选项
  let mailOptions = {
    from: `"FChat" <${MAIL_USER}>`,
    to,
    subject,
    text
  }

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: %s', info.messageId)
    }
  })
}

const cache = require('memory-cache')
const crypto = require('crypto')

// 生成四位验证码
function generateVerifyCode() {
  // 生成0到9999之间的随机整数
  const captcha = crypto.randomInt(0, 10000)
  // 将生成的整数转换为4位字符串
  return captcha.toString().padStart(4, '0')
}

// 存储验证码，设置过期时间（以毫秒为单位）
function storeVerifyCode(key, code, ttl) {
  cache.put(key, code, ttl) // ttl 是过期时间，以毫秒为单位
}

// 验证验证码
function verifyCode(key, inputCode) {
  const storedCode = cache.get(key)
  console.log('传入：', key, inputCode)
  console.log('存储：', storedCode)
  if (!storedCode) {
    return false // 验证码不存在
  }
  return storedCode === inputCode // 比较输入的验证码与存储的验证码
}

module.exports = {
  sendMail,
  generateVerifyCode,
  storeVerifyCode,
  verifyCode
}
