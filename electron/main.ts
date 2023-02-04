import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import { join } from 'path'

import registerIpc from './ipc/registerIpc'
import electronStore from './utils/store'

let mainWindow: BrowserWindow | null
const createWindow = () => {
  // デフォルトはダークモード
  const backgroundColor = electronStore.getItem('displayMode') === 'light' ? '#fff' : '#121212'
  // ブラウザウインドウを作成します。
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    titleBarStyle: 'hidden',
    backgroundColor: backgroundColor,
    frame: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  })

  // そしてアプリの index.html を読み込みます。
  const url = isDev ? 'http://localhost:8000/' : `file://${join(__dirname, '../out/index.html')}`
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Provides a more graceful experience and eliminates the white screen on load
  // This event fires after the app first render
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
  mainWindow.loadURL(url)
  mainWindow.maximize()
  registerIpc(mainWindow)

  // デベロッパー ツールを開きます。
  // mainWindow.webContents.openDevTools();
  // return mainWindow
}

// このメソッドは、Electron の初期化が完了し、
// ブラウザウインドウの作成準備ができたときに呼ばれます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.whenReady().then(async () => {
  await prepareNext('./')

  createWindow()
  // const ipcMainProxy = new IpcMainProxy(mainWindow)
  // ipcMainProxy.registerIpc()
  // registerIpc(mainWindow)

  app.on('activate', () => {
    // macOS では、Dock アイコンのクリック時に他に開いているウインドウがない
    // 場合、アプリのウインドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// macOS を除き、全ウインドウが閉じられたときに終了します。 ユーザーが
// Cmd + Q で明示的に終了するまで、アプリケーションとそのメニューバーを
// アクティブにするのが一般的です。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
