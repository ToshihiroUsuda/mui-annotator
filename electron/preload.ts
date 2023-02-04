import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('versions', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
})

contextBridge.exposeInMainWorld('electronRemote', {
  platform: process.platform,
})

contextBridge.exposeInMainWorld('currentWindow', {
  on: (listener: (event: IpcRendererEvent, eventName: string) => void) =>
    ipcRenderer.on('currentWindow:on', listener),
  minimize: () => ipcRenderer.send('currentWindow:minimize'),
  maximize: () => ipcRenderer.send('currentWindow:maximize'),
  unmaximize: () => ipcRenderer.send('currentWindow:unmaximize'),
  close: () => ipcRenderer.send('currentWindow:close'),
})

// Local File SystemのAPIを公開
contextBridge.exposeInMainWorld('localFileSystem', {
  selectContainer: () => ipcRenderer.invoke('localFileSystem:selectContainer'),

  readText: (filePath: string) => ipcRenderer.invoke('localFileSystem:readText', filePath),

  readBinary: (filePath: string) => ipcRenderer.invoke('localFileSystem:readBinary', filePath),

  writeText: (filePath: string, contents: string) =>
    ipcRenderer.send('localFileSystem:writeText', filePath, contents),

  writeBinary: (filePath: string, contents: Buffer) =>
    ipcRenderer.send('localFileSystem:writeBinary', filePath, contents),

  deleteFile: (filePath: string) => ipcRenderer.send('localFileSystem:deleteFile', filePath),

  listFiles: (folderPath: string) => ipcRenderer.invoke('localFileSystem:listFiles', folderPath),

  listContainers: (folderPath: string) =>
    ipcRenderer.invoke('localFileSystem:listContainers', folderPath),

  createContainer: (folderPath: string) =>
    ipcRenderer.send('localFileSystem:createContainer', folderPath),

  deleteContainer: (folderPath: string) =>
    ipcRenderer.send('localFileSystem:deleteContainer', folderPath),
})

contextBridge.exposeInMainWorld('electronStore', {
  setItem: (key: string, val: string) => ipcRenderer.send('electronStore:setItem', key, val),
})
