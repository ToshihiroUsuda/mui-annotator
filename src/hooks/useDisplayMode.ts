import { PaletteMode } from '@mui/material'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

import { displayModeAtom } from '../state/atoms'

const useDisplayMode = () => {
  const [displayMode, setDisplayMode] = useAtom(displayModeAtom)
  const toggle = useCallback(
    () => setDisplayMode((mode: PaletteMode) => (mode === 'light' ? 'dark' : 'light')),
    [setDisplayMode],
  )
  return [displayMode, toggle] as const
}

export default useDisplayMode
