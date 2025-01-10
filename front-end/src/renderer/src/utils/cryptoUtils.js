import { useUserStore } from '@r/stores/user.js'

class RSAEncryption {
  constructor(publicKeyJWK, privateKeyJWK) {
    this.publicKeyJWK = publicKeyJWK
    this.privateKeyJWK = privateKeyJWK
  }

  // 静态方法：创建实例并导入密钥
  static async create(publicKeyJWK, privateKeyJWK) {
    const instance = new RSAEncryption(publicKeyJWK, privateKeyJWK)
    await instance.importKeys()
    return instance
  }

  // 导入公钥和私钥
  async importKeys() {
    this.publicKey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(this.publicKeyJWK),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    )

    if (this.privateKeyJWK) {
      this.privateKey = await window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(this.privateKeyJWK),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
      )
    }
  }

  // 生成 RSA 密钥对
  async generateRSAKeyPair() {
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

  // 使用 RSA 数据加密数据
  async encrypt(data) {
    // 将数据转换为 Uint8Array
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)

    // 使用公钥加密数据
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' }, // 加密算法
      this.publicKey, // 公钥
      dataBytes // 要加密的数据
    )

    // 将加密后的数据转换为 Base64 字符串
    return arrayBufferToBase64(encryptedData)
  }

  // 使用 RSA 私钥解密数据
  async decrypt(encryptedData) {
    // 将 Base64 编码的加密数据转换为 ArrayBuffer
    const encryptedDataArray = base64ToArrayBuffer(encryptedData)

    // 使用私钥解密数据
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' }, // 解密算法
      this.privateKey, // 私钥
      encryptedDataArray // 加密后的数据
    )

    // 将解密后的数据转换为字符串
    return new TextDecoder().decode(decryptedData)
  }

  // 获取当前用户的私钥
  static async getPrivateKey() {
    const { user } = useUserStore()
    const { privateKey: privateKeyJWKString } = await window.api.getPrivateKey(user._id)
    if (!privateKeyJWKString) {
      throw new Error('Private key not found for user: ' + user._id)
    }

    return privateKeyJWKString
  }
}

/* ========================================================================================================================================================== */

class AESEncryption {
  constructor(key) {
    this.key = key
  }

  // 静态方法：创建实例并生成或导入密钥
  static async create(keyJWK) {
    let key
    if (keyJWK) {
      key = await window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(keyJWK),
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
    } else {
      key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
        'encrypt',
        'decrypt'
      ])
    }
    return new AESEncryption(key)
  }

  // 生成 AES 密钥
  async generateAESKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    )
    return key
  }

  // 导出密钥为 JWK 格式
  async exportKey() {
    return await window.crypto.subtle.exportKey('jwk', this.key)
  }

  // 使用 AES 加密数据
  async encrypt(data) {
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)

    // 生成初始化向量 (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    // 使用 AES-GCM 加密数据
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      dataBytes
    )

    // 将 IV 和加密数据合并为单个 ArrayBuffer
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    // 将结果转换为 Base64 字符串
    return arrayBufferToBase64(combined)
  }

  // 使用 AES 解密数据
  async decrypt(encryptedData) {
    // 将 Base64 编码的加密数据转换为 ArrayBuffer
    const combined = base64ToArrayBuffer(encryptedData)

    // 提取 IV 和加密数据
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    // 使用 AES-GCM 解密数据
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      data
    )

    // 将解密后的数据转换为字符串
    return new TextDecoder().decode(decryptedData)
  }
}
/* ========================================================================================================================================================== */

/**
 * 工具函数
 */

// 将 ArrayBuffer 转换为 Base64 编码的字符串
function arrayBufferToBase64(buffer) {
  const uint8Array = new Uint8Array(buffer)
  let binary = ''
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

// 将 Base64 编码的字符串转换为 ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export { RSAEncryption, AESEncryption }
