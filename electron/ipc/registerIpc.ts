import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'

import LocalFileSystem from '../utils/localFileSystem'
import electronStore from '../utils/store'

const registerIpcMainHandle = (
  channel: string,
  listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any,
): void => {
  ipcMain.removeHandler(channel)
  ipcMain.handle(channel, listener)
}

const registerIpcMainOn = (
  channel: string,
  listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any,
): void => {
  ipcMain.removeAllListeners(channel)
  ipcMain.on(channel, listener)
}

const registerIpc = (browserWindow: BrowserWindow): void => {
  const localFileSystem = new LocalFileSystem(browserWindow)
  registerIpcMainHandle('localFileSystem:selectContainer', async () => {
    return await localFileSystem.selectContainer()
  })

  registerIpcMainHandle(
    'localFileSystem:readText',
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      return await localFileSystem.readText(filePath)
    },
  )
  registerIpcMainHandle(
    'localFileSystem:readBinary',
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      return await localFileSystem.readBinary(filePath)
    },
  )
  registerIpcMainOn(
    'localFileSystem:writeText',
    async (_event: IpcMainInvokeEvent, filePath: string, contents: string) => {
      await localFileSystem.writeText(filePath, contents)
    },
  )
  registerIpcMainOn(
    'localFileSystem:writeBinary',
    async (_event: IpcMainInvokeEvent, filePath: string, contents: Buffer) => {
      await localFileSystem.writeBinary(filePath, contents)
    },
  )
  registerIpcMainOn(
    'localFileSystem:deleteFile',
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      await localFileSystem.deleteFile(filePath)
    },
  )
  registerIpcMainHandle(
    'localFileSystem:listFiles',
    async (_event: IpcMainInvokeEvent, folderPath: string) => {
      return await localFileSystem.listFiles(folderPath)
    },
  )
  registerIpcMainHandle(
    'localFileSystem:listContainers',
    async (_event: IpcMainInvokeEvent, folderPath: string) => {
      return await localFileSystem.listContainers(folderPath)
    },
  )
  registerIpcMainOn(
    'localFileSystem:createContainer',
    async (_event: IpcMainInvokeEvent, folderPath: string) => {
      await localFileSystem.createContainer(folderPath)
    },
  )
  registerIpcMainOn(
    'localFileSystem:deleteContainer',
    async (_event: IpcMainInvokeEvent, folderPath: string) => {
      await localFileSystem.deleteContainer(folderPath)
    },
  )

  registerIpcMainOn('currentWindow:minimize', () => {
    browserWindow.minimize()
  })

  registerIpcMainOn('currentWindow:maximize', () => {
    browserWindow.maximize()
  })

  registerIpcMainOn('currentWindow:unmaximize', () => {
    browserWindow.unmaximize()
  })

  registerIpcMainOn('currentWindow:close', () => {
    browserWindow.close()
  })

  browserWindow.on('maximize', () => browserWindow.webContents.send('currentWindow:on', 'maximize'))
  browserWindow.on('unmaximize', () =>
    browserWindow.webContents.send('currentWindow:on', 'unmaximize'),
  )
  browserWindow.on('enter-full-screen', () =>
    browserWindow.webContents.send('currentWindow:on', 'enter-full-screen'),
  )
  browserWindow.on('leave-full-screen', () =>
    browserWindow.webContents.send('currentWindow:on', 'leave-full-screen'),
  )

  registerIpcMainOn(
    'electronStore:setItem',
    (_event: IpcMainInvokeEvent, key: string, val: string) => {
      electronStore.setItem(key, val)
    },
  )
}

export default registerIpc
