const express = require('express')
const axios = require('axios')
const router = express.Router()
const Result = require('../class/Result')
const userService = require('../services/userService')

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRETS, REDIRECT_URI } = process.env

// 处理 GitHub OAuth 回调
router.get('/callback', async (req, res) => {
  const code = req.query.code
  console.log('接收到code：', code)
  if (!code) {
    console.log('code为空')
    return res.json(Result.error('Authorization code not found'))
  }

  // 通过授权码获取访问令牌
  const tokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRETS,
      code: code,
      redirect_uri: REDIRECT_URI
    },
    {
      headers: { Accept: 'application/json' }
    }
  )

  const accessToken = tokenResponse.data.access_token
  if (!accessToken) {
    console.log('accessToken为空', tokenResponse)
    return res.json(Result.error(400, 'Failed to get access token'))
  }

  // 使用访问令牌获取用户信息
  const userResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`
    }
  })

  const user = userResponse.data
  console.log('user:', user)
  // 通过github_id查看用户是否已注册
  const userInfo = await userService.getGithubUser(user.id)
  if (!userInfo) {
    // 注册新用户
    await userService.registerUser({
      username: user.name,
      email: user.email,
      avatar: user.avatar_url,
      githubId: user.id
    })
  }
  // 登录
  const loginRes = await userService.loginUser({ githubId: user.id })
  res.json(Result.success(loginRes, 'Login successful'))
})

module.exports = router
