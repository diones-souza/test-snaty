import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#662985'
    },
    secondary: {
      main: '#2235df'
    },
    error: {
      main: red.A400
    }
  }
})

export default theme
