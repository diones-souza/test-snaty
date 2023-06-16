import React, { PropsWithChildren, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Notify: NextPage<PropsWithChildren<SnackbarProps>> = ({
  anchorOrigin,
  autoHideDuration,
  open,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    }
    if (autoHideDuration) {
      setTimeout(() => {
        setIsOpen(false)
      }, autoHideDuration * 1000) // segundos
    }
  }, [open, autoHideDuration])

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setIsOpen(false)
  }

  return (
    <Snackbar anchorOrigin={anchorOrigin} open={isOpen}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  )
}

export { Notify }
