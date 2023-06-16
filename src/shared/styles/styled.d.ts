/* eslint @typescript-eslint/no-empty-interface: "off" */

import { Theme } from '@mui/material/styles'

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}
