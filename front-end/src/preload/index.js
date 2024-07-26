import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // changeTitleBar: (titleBar) => {
  //   ipcRenderer.send('change-title-bar', titleBar)
  // },
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
  // main -> renderer
  changeMaximize: (callback) => {
    ipcRenderer.on('maximized', () => {
      callback(true)
    })
    ipcRenderer.on('unmaximized', () => {
      callback(false)
    })
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
