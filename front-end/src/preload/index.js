import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openNewWindow: (settings) => {
    ipcRenderer.send('open-new', settings)
  },
  openDialog: (settings) => {
    ipcRenderer.send('open-dialog', settings)
  },
  closeDialog: () => {
    ipcRenderer.send('close-dialog')
  },
  minimize: () => {
    ipcRenderer.send('minimize')
  },
  maximize: (b) => {
    if (b) {
      ipcRenderer.send('maximize')
    } else {
      ipcRenderer.send('unmaximize')
    }
  },
  closeWindow: () => {
    ipcRenderer.send('close-window')
  },
  sendEmoji: (id) => {
    ipcRenderer.send('send-emoji', id)
  },

  // main -> renderer
  changeMaximize: (callback) => {
    ipcRenderer.on('maximized', () => {
      callback(true)
    })
    ipcRenderer.on('unmaximized', () => {
      callback(false)
    })
  },
  receiveEmoji: (callback) => {
    // 先移除之前的监听器，确保只有一个回调函数
    ipcRenderer.removeAllListeners('receive-emoji')

    // 然后添加新的监听器
    ipcRenderer.on('receive-emoji', (event, id) => {
      callback(id)
    })
  },
  // 打开外部链接
  openExternal: (url) => {
    ipcRenderer.send('open-external', url)
  },
  // 登出
  logout: () => {
    ipcRenderer.send('logout')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
