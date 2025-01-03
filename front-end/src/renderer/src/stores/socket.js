import { defineStore } from 'pinia'
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

export const useSocketStore = defineStore('socket', () => {
  // 配置信息
  const { VITE_API_KEY: API_KEY, VITE_API_SECRET: API_SECRET, VITE_APPID: APPID } = import.meta.env
  const httpUrl = new URL('https://spark-api.xf-yun.com/v1.1/chat')
  const modelDomain = 'lite'

  // 获取socket路径
  function getUrl() {
    return new Promise((resolve) => {
      let apiKey = API_KEY
      let apiSecret = API_SECRET
      let url = 'wss://' + httpUrl.host + httpUrl.pathname
      let host = location.host
      let date = new Date().toGMTString()
      let algorithm = 'hmac-sha256'
      let headers = 'host date request-line'
      let signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrl.pathname} HTTP/1.1`
      let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      let signature = CryptoJS.enc.Base64.stringify(signatureSha)
      let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      let authorization = btoa(authorizationOrigin)
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
      resolve(url)
    })
  }

  class TTSRecorder {
    constructor({ appId = APPID } = {}) {
      this.appId = appId
      this.status = 'init'
    }

    // 修改状态
    setStatus(status) {
      this.onWillStatusChange && this.onWillStatusChange(this.status, status)
      this.status = status
    }

    // 连接websocket
    connectWebSocket() {
      return new Promise((resolve, reject) => {
        this.setStatus('ttsing')
        getUrl().then((url) => {
          let ttsWS = new WebSocket(url)
          this.ttsWS = ttsWS

          ttsWS.onopen = () => {
            this.webSocketSend()
          }

          ttsWS.onerror = (err) => {
            clearTimeout(this.playTimeout)
            this.setStatus('error')
            console.error(`WebSocket连接错误: ${err}`)
            reject(new Error(`WebSocket连接失败`))
          }

          ttsWS.onclose = (e) => {
            console.log('WebSocket关闭:', e)
            if (this.forTitle) {
              resolve(this.total_res)
            } else {
              this.onWillClose && this.onWillClose()
              resolve()
            }
          }

          ttsWS.onmessage = (e) => {
            this.result(e.data)
          }
        })
      })
    }

    // websocket发送数据
    webSocketSend() {
      var params = {
        header: {
          app_id: this.appId,
          uid: 'fd3f47e4-d'
        },
        parameter: {
          chat: {
            domain: modelDomain,
            temperature: 0.5,
            max_tokens: 1024
          }
        },
        payload: {
          message: {
            text: [
              // {
              //   role: 'user',
              //   content: '你将扮演一个聊天软件中的个人助手，请回答用户的问题。'
              // },
              ...this.texts
            ]
          }
        }
      }
      this.ttsWS.send(JSON.stringify(params))
    }

    start(texts, forTitle = false) {
      this.texts = texts
      this.forTitle = forTitle
      this.total_res = '' // 请空回答历史
      return this.connectWebSocket()
    }

    // websocket接收数据的处理
    result(resultData) {
      let jsonData = JSON.parse(resultData)
      this.total_res = this.total_res + jsonData.payload.choices.text[0].content
      // 提问失败
      if (jsonData.header.code !== 0) {
        alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
        console.error(`${jsonData.header.code}:${jsonData.header.message}`)
        return
      }
      // 修改界面文本
      if (!this.forTitle) {
        newAiMsg.value.content += jsonData.payload.choices.text[0].content
      }

      if (jsonData.header.code === 0 && jsonData.header.status === 2) {
        this.ttsWS.close()
        webSocket.value.setStatus('init')
      }
    }
  }

  // 实例对象
  const webSocket = ref(new TTSRecorder())

  // 最新生成的消息
  const newAiMsg = ref({
    senderId: 'ai',
    content: ''
  })

  return {
    webSocket,
    newAiMsg
  }
})
