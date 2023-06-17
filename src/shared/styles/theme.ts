import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2235df'
    },
    secondary: {
      main: '#2f71e0'
    },
    error: {
      main: red.A400
    }
  }
})

export default theme
