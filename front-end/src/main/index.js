import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../public/icons/icon.png'
import axios from 'axios'
import log from 'electron-log'

/**
 *  绑定通用的ipc事件
 */
// 关闭当前页面，打开新的页面
ipcMain.on('open-new', (event, settings) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.close()
  }
  createBrowserWindow(settings)
})

// 打开窗口
ipcMain.on('open-dialog', (event, settings) => {
  createBrowserWindow({
    parent: BrowserWindow.fromWebContents(event.sender),
    resizable: false,
    maximizable: false,
    minimizable: false,
    ...settings
  })
})

// 标题栏按钮事件
ipcMain.on('minimize', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.minimize()
  }
})
ipcMain.on('maximize', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.maximize()
  }
})
ipcMain.on('unmaximize', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.unmaximize()
  }
})
ipcMain.on('close-window', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.close()
  }
})

ipcMain.on('close-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.close()
  }
})

ipcMain.on('send-emoji', (event, id) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender).getParentWindow()
  browserWindow.webContents.send('receive-emoji', id)
})

// 打开外部链接
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url)
})

// 登出
ipcMain.on('logout', (event) => {
  // 关闭当前窗口
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow) {
    browserWindow.close()
  }
  // 打开登录窗口
  createMainWindow()
})

// 返回注册结果
ipcMain.on('return-register', (event, data) => {
  // 获取父窗口
  const browserWindow = BrowserWindow.fromWebContents(event.sender).getParentWindow()
  browserWindow.webContents.send('register-callback', data)
})

// 创建新窗口
function createBrowserWindow({
  route,
  width = 900,
  height = 600,
  minWidth = 0,
  minHeight = 0,
  resizable = true,
  maximizable = true,
  minimizable = true,
  frame = false,
  parent = null,
  modal = false,
  closeOnBlur = false,
  title = 'FChat',
  show = false,
  skipTaskbar = false
}) {
  // 配置路径
  process.env.ROOT = join(__dirname, '../../')
  const winURL = is.dev
    ? process.env.ELECTRON_RENDERER_URL
    : `file://${join(__dirname, '../renderer/index.html')}`

  // 创建窗口
  const win = new BrowserWindow({
    backgroundColor: '#00ffffff',
    width,
    height,
    minWidth,
    minHeight,
    resizable,
    maximizable,
    minimizable,
    show,
    autoHideMenuBar: true,
    parent,
    modal,
    title,
    frame,
    skipTaskbar,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 页面加载完成
  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 加载页面
  const $url = route ? `${winURL}#${route}` : winURL
  win.loadURL($url)

  // 监听窗口最大化/取消最大化
  win.on('maximize', () => {
    win.webContents.send('maximized')
  })
  win.on('unmaximize', () => {
    win.webContents.send('unmaximized')
  })

  // 失焦时关闭窗口
  if (closeOnBlur) {
    win.on('blur', () => {
      win.close()
    })
  }
}

// 创建主窗口
function createMainWindow() {
  createBrowserWindow({
    height: 540,
    width: 900,
    route: '/login',
    resizable: false,
    maximizable: false,
    minimizable: false,
    frame: true
  })
}

//设置锁保证只有单个实例运行
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit() // 如果获取不到锁，退出新启动的实例
} else {
  /**
   * Github OAuth验证
   */

  // 注册自定义协议
  app.setAsDefaultProtocolClient('fchat')
  // 捕获Github校验回调
  app.on('open-url', async (event, url) => {
    // 解析GitHub回调中的授权码
    const urlParams = new URL(url)
    const authorizationCode = urlParams.searchParams.get('code')

    if (authorizationCode) {
      console.log('Authorization Code: ', authorizationCode)
      log.info('Authorization Code: ', authorizationCode)
      log.info(
        '地址：',
        `http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/auth/github/callback`
      )
      // 将授权码发送到后端处理
      try {
        const { data: res } = await axios.get(
          `http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/auth/github/callback`,
          {
            params: {
              code: authorizationCode
            }
          }
        )
        // 通知渲染进程登录结果
        const win = BrowserWindow.getAllWindows()[0]
        if (win) {
          win.webContents.send('github-login', res)
          log.info('授权登录', res)
        } else {
          log.error('窗口获取失败')
        }
      } catch (err) {
        log.error('服务器内部错误', err)
      }
    }
  })

  app.on('second-instance', (event, commandLine) => {
    // 检查是否包含 fchat:// 协议的 URL
    const url = commandLine.find((arg) => arg.startsWith('fchat://'))
    if (url) {
      // 手动触发 open-url 事件，确保逻辑处理
      app.emit('open-url', event, url)
    }

    // 获取当前已有的窗口，并聚焦该窗口
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 就绪后打开窗口
  app.whenReady().then(() => {
    // 设置快捷键打开控制台
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.webContents.toggleDevTools() // 开启或关闭控制台
      }
    })

    // 检查是否通过协议启动的
    const url = process.argv.find((arg) => arg.startsWith('fchat://'))
    if (url) {
      app.emit('open-url', {}, url)
    }

    // 创建窗口
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
    ipcMain.on('ping', () => console.log('pong'))
    createMainWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
  })

  // 窗口全关闭时退出程序
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
