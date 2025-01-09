import { useUserStore } from '@r/stores/user.js'

// 生成 RSA 密钥对
export async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP', // 加密算法类型，使用 RSA 加密
      modulusLength: 2048, // 密钥长度，2048 位较为安全
      publicExponent: new Uint8Array([1, 0, 1]), // 公钥指数
      hash: 'SHA-256' // 使用 SHA-256 进行散列
    },
    true, // 是否可以导出密钥
    ['encrypt', 'decrypt'] // 公钥用于加密，私钥用于解密
  )

  // 导出公钥
  const publicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey)

  // 导出私钥
  const privateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey)

  return { publicKey, privateKey }
}

// 使用私钥解密信息
export async function decryptMessage(encryptedData) {
  // 获取私钥
  const { user } = useUserStore()
  const { privateKey: privateKeyJWKString } = await window.api.getPrivateKey(user._id)
  if (!privateKeyJWKString) {
    throw new Error('Private key not found for user: ' + user._id)
  }

  // 解析 JWK 格式的私钥
  const privateKeyJWK = JSON.parse(privateKeyJWKString)

  // 导入私钥
  const privateKey = await window.crypto.subtle.importKey(
    'jwk', // 私钥格式为 JWK
    privateKeyJWK, // JWK 格式的私钥
    { name: 'RSA-OAEP', hash: 'SHA-256' }, // 使用的加密算法
    false, // 不允许导出私钥
    ['decrypt'] // 仅允许用于解密
  )

  // 处理传入的 Base64 编码的加密数据
  const encryptedDataArray = new Uint8Array(
    atob(encryptedData)
      .split('')
      .map((c) => c.charCodeAt(0))
  )
  try {
    // 使用私钥解密数据
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' }, // 解密算法
      privateKey, // 私钥
      encryptedDataArray // 加密后的消息
    )
    // 解密后的数据是 ArrayBuffer 格式，转换为字符串
    const decryptedMessage = new TextDecoder().decode(decryptedData)
    return decryptedMessage
  } catch (err) {
    console.error('Decryption failed:', err)
    console.error('Error details:', err.toString()) // 输出更多详细错误信息
    if (err instanceof DOMException) {
      console.error('DOMException details:', err.code, err.name, err.message) // 如果是DOMException，可以获取错误码、错误名称等信息
    }
    throw new Error('Decryption failed: ' + err.message)
  }
}

// 使用公钥加密信息
export async function encryptMessage(publicKeyJWK, message) {
  if (!publicKeyJWK) return message
  // 1. 导入公钥
  const publicKey = await window.crypto.subtle.importKey(
    'jwk', // 公钥格式为 JWK
    JSON.parse(publicKeyJWK), // JWK 格式的公钥
    { name: 'RSA-OAEP', hash: 'SHA-256' }, // 加密算法
    false, // 不允许导出公钥
    ['encrypt'] // 仅允许用于加密
  )

  // 2. 将消息转换为字节流（Uint8Array）
  const encoder = new TextEncoder()
  const messageBytes = encoder.encode(message)

  // 3. 使用公钥加密消息
  try {
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' }, // 加密算法
      publicKey, // 公钥
      messageBytes // 消息的字节流
    )

    // 加密后的数据是 ArrayBuffer 格式，可以将其转换为 Base64 编码的字符串
    const encryptedBase64 = arrayBufferToBase64(encryptedData)
    return encryptedBase64
  } catch (err) {
    console.error('Encryption failed:', err)
    throw new Error('Encryption failed: ' + err.message)
  }
}
// 将 ArrayBuffer 转换为 Base64 编码的字符串
function arrayBufferToBase64(buffer) {
  const uint8Array = new Uint8Array(buffer)
  let binary = ''
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}
