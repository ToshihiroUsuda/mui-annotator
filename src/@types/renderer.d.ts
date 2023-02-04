export interface IVersions {
  chrome: string
  electron: string
  node: string
}

export interface IElectronRemote {
  platform: NodeJS.Platform
}
export interface ICurrentWindow {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  unmaximize: () => Promise<void>
  close: () => Promise<void>
  on: (listener: (event: IpcRendererEvent, eventName: string) => void) => Promise<void>
}

export interface ILocalFileSystem {
  selectContainer: () => Promise<string>
  createContainer: (folderPath: string) => Promise<void>
  deleteContainer: (folderPath: string) => Promise<void>
  deleteFile: (filePath: string) => Promise<void>
  listContainers: (folderPath: string) => Promise<string[]>
  listFiles: (folderPath: string) => Promise<string[]>
  readBinary: (filePath: string) => Promise<Buffer>
  readText: (filePath: string) => Promise<string>
  writeBinary: (filePath: string, contents: Buffer) => Promise<void>
  writeText: (filePath: string, contents: string) => Promise<void>
}

export interface IElectronStore {
  setItem: (key: string, val: string) => void
}

declare global {
  interface Window {
    currentWindow: ICurrentWindow
    electronRemote: IElectronRemote
    localFileSystem: ILocalFileSystem
    versions: IVersions
    electronStore: IElectronStore
  }
}
