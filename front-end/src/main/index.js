import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../public/icons/icon.png'

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

// 打开模态窗口
ipcMain.on('open-dialog', (event, settings) => {
  createBrowserWindow({
    ...settings,
    parent: BrowserWindow.fromWebContents(event.sender),
    modal: true,
    resizable: false,
    maximizable: false,
    minimizable: false
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

function createBrowserWindow({
  route,
  width = 900,
  height = 600,
  minWidth = 600,
  minHeight = 500,
  resizable = true,
  maximizable = true,
  minimizable = true,
  barHeight = 20,
  barColor = '#000',
  frame = false,
  parent = null,
  shadow = false,
  modal = false,
  closeOnBlur = false,
  closeButton = true
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
    show: false,
    autoHideMenuBar: true,
    parent,
    modal,
    hasShadow: shadow,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    frame,
    titleBarStyle: frame ? 'hidden' : 'default',
    titleBarOverlay: closeButton
      ? {
          color: '#00000000',
          symbolColor: barColor,
          height: barHeight
        }
      : null
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

  // 表情窗口特殊处理
  if (route && route === '/emoji') {
    // 发送表情
    const sendEmojiFunc = (event, id) => {
      parent.webContents.send('receive-emoji', id)
    }

    ipcMain.on('close-dialog', (event) => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender)
      if (browserWindow) {
        ipcMain.removeListener('send-emoji', sendEmojiFunc)
        browserWindow.close()
      }
    })

    ipcMain.on('send-emoji', sendEmojiFunc)

    if (closeOnBlur && !closeButton) {
      win.on('blur', () => {
        ipcMain.removeListener('send-emoji', sendEmojiFunc)
        win.close()
      })
    }
  }
}

// 创建主窗口
function createMainWindow() {
  createBrowserWindow({
    height: 500,
    width: 360,
    minHeight: 0,
    minWidth: 0,
    route: '/login',
    resizable: false,
    maximizable: false,
    minimizable: false,
    barHeight: 40,
    barColor: '#fff',
    frame: true
  })
}

app.whenReady().then(() => {
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
