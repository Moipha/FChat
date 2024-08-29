import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../public/icons/icon.png'

function createWindow({
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
  frame = false
}) {
  // 配置路径
  process.env.ROOT = join(__dirname, '../../')
  const winURL = is.dev
    ? process.env.ELECTRON_RENDERER_URL
    : `file://${join(__dirname, '../renderer/index.html')}`

  // Create the browser window.
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
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    frame,
    titleBarStyle: frame ? 'hidden' : 'default',
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: barColor,
      height: barHeight
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
  let $url
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    $url = route
      ? `${process.env.ELECTRON_RENDERER_URL}#${route}`
      : process.env.ELECTRON_RENDERER_URL
  } else {
    $url = route ? `${winURL}#${route}` : winURL
  }
  win.loadURL($url)
  // 打包环境中打开开发者工具
  if (!is.dev) {
    win.webContents.openDevTools()
  }
  // 关闭当前页面，打开新的页面
  ipcMain.on('open-new', (event, settings) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender)
    if (browserWindow) {
      // 先移除所有的监听事件
      ipcMain.removeAllListeners()
      browserWindow.close()
    }
    createWindow(settings)
  })

  ipcMain.on('open-dialog', (event, settings) => {
    createModalWin(settings, win)
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
  // 监听窗口最大化
  win.on('maximize', () => {
    win.webContents.send('maximized')
  })
  // 监听窗口取消最大化
  win.on('unmaximize', () => {
    win.webContents.send('unmaximized')
  })
}

// 创建model窗口
function createModalWin(
  { route, width = 200, height = 400, shadow = false, close = true, modal = true },
  parent
) {
  const win = new BrowserWindow({
    width,
    height,
    parent,
    hasShadow: shadow,
    resizable: false,
    maximizable: false,
    minimizable: false,
    show: false,
    modal,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },

    titleBarStyle: 'hidden',
    titleBarOverlay: close
      ? {
          color: '#00000000',
          symbolColor: '#000',
          height: 40
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

  // 配置路径
  process.env.ROOT = join(__dirname, '../../')
  const winURL = is.dev
    ? process.env.ELECTRON_RENDERER_URL
    : `file://${join(__dirname, '../renderer/index.html')}`

  // 加载页面
  let $url
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    $url = route
      ? `${process.env.ELECTRON_RENDERER_URL}#${route}`
      : process.env.ELECTRON_RENDERER_URL
  } else {
    $url = route ? `${winURL}#${route}` : winURL
  }
  win.loadURL($url)

  // 关闭窗口
  ipcMain.on('close-dialog', (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender)
    if (browserWindow) {
      ipcMain.removeListener('send-emoji', sendEmojiFunc)
      browserWindow.close()
    }
  })
  function sendEmojiFunc(event, id) {
    parent.webContents.send('receive-emoji', id)
  }
  ipcMain.on('send-emoji', sendEmojiFunc)

  if (!close) {
    // 失去焦点时关闭窗口
    win.on('blur', () => {
      ipcMain.removeListener('send-emoji', sendEmojiFunc)
      win.close()
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow({
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

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
