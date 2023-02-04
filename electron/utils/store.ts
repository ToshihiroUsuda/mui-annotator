import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const filePath = path.normalize(path.join(app.getPath('userData'), 'store.json'))

const readFile = (filePath: string): Record<string, string> => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath)
    return JSON.parse(data.toString())
  } else {
    return {}
  }
}

const electronStore = {
  setItem: (key: string, value: string): void => {
    const store = { ...readFile(filePath), [key]: value }
    fs.writeFileSync(filePath, JSON.stringify(store))
  },

  getItem: (key: string): string | null => {
    const store = readFile(filePath)
    return key in store ? JSON.parse(store[key]) : null
  },

  removeItem: (key: string): void => {
    const store = readFile(filePath)
    delete store[key]
    fs.writeFileSync(filePath, JSON.stringify(store))
  },

  clear: (): void => {
    fs.writeFileSync(filePath, JSON.stringify({}))
  },
}

export default electronStore
