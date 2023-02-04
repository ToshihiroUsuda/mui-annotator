import { PaletteMode } from '@mui/material'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const atomWithMyStorage = <T>(key: string, initialValue: T) => {
  const baseAtom = atomWithStorage(key, initialValue)
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
      window.electronStore.setItem(key, JSON.stringify(nextValue))
    },
  )
  return derivedAtom
}

export const displayModeAtom = atomWithMyStorage<PaletteMode>('displayMode', 'dark')
