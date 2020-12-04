'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'

import ElectronStore from 'electron-store'
// import adb from './assets/js/adb'
const electronStore = new ElectronStore();
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 600,
    maximizable: false,
    // icon: `public/panda.ico`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  

}
//监听获取配置信息事件
ipcMain.on('getWeappConfig', (event) => {
  event.reply('getWeappConfig-reply', electronStore.get('weappConfig'))
})
//监听设置配置信息事件
ipcMain.on('setWeappConfig', (event, arg) => {
  electronStore.set('weappConfig', arg)
  event.reply('setWeappConfig-reply', electronStore.get('weappConfig'))
})
//监听获取小程序列表事件
ipcMain.on('getWeappList', (event) => {
  let weappList = electronStore.get('weappList') || []

  event.reply('getWeappList-reply', weappList)
})
//监听设置小程序列表
ipcMain.on('setWeappList', (event, arg) => {
  electronStore.set('weappList', arg)
  event.reply('setWeappList-reply', electronStore.get('weappList'))
})
//监听获取镜像设置
ipcMain.on('getMirrorConfig', (event) => {
  let mirrorConfig = electronStore.get('mirrorConfig')

  event.reply('getMirrorConfig-reply', mirrorConfig)
})
//监听设置镜像事件
ipcMain.on('setMirrorConfig', (event, arg) => {
  electronStore.set('mirrorConfig', arg)
  event.reply('setMirrorConfig-reply', electronStore.get('mirrorConfig'))
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


app.on('ready', async () => {
  
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
