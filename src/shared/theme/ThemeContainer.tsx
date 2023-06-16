import React, { PropsWithChildren } from 'react'
import type { NextPage } from 'next'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../styles/theme'

interface Props {
  children: any
}

const ThemeContainer: NextPage<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default ThemeContainer
