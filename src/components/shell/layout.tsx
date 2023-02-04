import React from 'react'

import TitleBar from './titleBar'

const Layout: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
  return (
    <>
      <TitleBar />
      {props.children}
    </>
  )
}

export default Layout
