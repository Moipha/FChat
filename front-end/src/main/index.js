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
