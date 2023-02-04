import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CloseIcon from '@mui/icons-material/Close'
import MaximizeIcon from '@mui/icons-material/Maximize'
import MinimizeIcon from '@mui/icons-material/Minimize'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { IpcRendererEvent } from 'electron'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import useDisplayMode from '../../hooks/useDisplayMode'

const PlatformType = {
  Windows: 'win32',
  Linux: 'linux',
  MacOS: 'darwin',
} as const

const TitleBar: React.FC = () => {
  const platform: NodeJS.Platform = useMemo(() => {
    return globalThis.window?.electronRemote.platform
  }, [])

  const [maximized, setMaximized] = useState(true)
  const [fullscreen, setFullScreen] = useState(false)
  const [displayMode, toggleMode] = useDisplayMode()

  useEffect(() => {
    ;(async () => {
      window.currentWindow.on((_event: IpcRendererEvent, eventName: string) => {
        switch (eventName) {
          case 'maximize':
            setMaximized(true)
            break
          case 'unmaximize':
            setMaximized(false)
            break
          case 'enter-full-screen':
            setFullScreen(true)
            break
          case 'leave-full-screen':
            setFullScreen(false)
            break
          default:
            break
        }
      })
    })()
  }, [])

  const minimizeWindow = useCallback(() => {
    globalThis.window?.currentWindow.minimize()
  }, [])

  const maximizeWindow = useCallback(() => {
    globalThis.window?.currentWindow.maximize()
  }, [])

  const unMaximizeWindow = useCallback(() => {
    globalThis.window?.currentWindow.unmaximize()
  }, [])

  const closeWindow = useCallback(() => {
    globalThis.window?.currentWindow.close()
  }, [])

  if (fullscreen) {
    return null
  }

  return (
    <AppBar
      position='fixed'
      color='primary'
      sx={{
        display: 'flex',
        // justifyContent: 'flex-end',
        flexDirection: 'row',
        pr: 2,
        height: '36px',
        WebkitAppRegion: 'drag',
        WebkitUserSelect: 'none',
      }}
    >
      <Box component='div' sx={{ display: platform === PlatformType.Windows ? 'block' : 'none' }}>
        {displayMode === 'light' && (
          <IconButton aria-label='light mode' onClick={toggleMode} size='small'>
            <Brightness4Icon />
          </IconButton>
        )}
        {displayMode === 'dark' && (
          <IconButton aria-label='dark mode' onClick={toggleMode} size='small'>
            <Brightness7Icon />
          </IconButton>
        )}
        <IconButton aria-label='minimize' onClick={minimizeWindow} size='small'>
          <MinimizeIcon />
        </IconButton>
        {!maximized && (
          <IconButton aria-label='maximize' onClick={maximizeWindow} size='small'>
            <MaximizeIcon />
          </IconButton>
        )}
        {maximized && (
          <IconButton aria-label='unmaximize' onClick={unMaximizeWindow} size='small'>
            <WebAssetIcon />
          </IconButton>
        )}
        <IconButton aria-label='close' onClick={closeWindow} size='small'>
          <CloseIcon />
        </IconButton>
      </Box>
    </AppBar>
  )
}

export default TitleBar
