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

type NotifyProps = PropsWithChildren<SnackbarProps> & {
  color: any
  icon: any
  onClose(): void
}

const Notify: NextPage<NotifyProps> = ({
  anchorOrigin,
  autoHideDuration,
  open,
  color,
  icon,
  children,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    }
    if (autoHideDuration) {
      setTimeout(() => {
        setIsOpen(false)
        onClose()
      }, autoHideDuration * 1000)
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
    onClose()
  }

  return (
    <Snackbar anchorOrigin={anchorOrigin} open={isOpen}>
      <Alert
        icon={icon}
        onClose={handleClose}
        color={color}
        sx={{ width: '100%' }}
      >
        {children}
      </Alert>
    </Snackbar>
  )
}

export { Notify }
