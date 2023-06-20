import React, { PropsWithChildren, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import {
  TextField,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog,
  DialogProps,
  Box,
  Divider
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import * as yup from 'yup'
import api from '../../services/api'

export interface Vehicle {
  id?: number
  placa: string
  marcaModelo: string
  anoFabricacao: string
  kmAtual: string
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type FormClientProps = PropsWithChildren<DialogProps> & {
  onClose: () => void
  onSave: (message: string, status: string) => void
}

const FormVehicle: NextPage<FormClientProps> = ({ open, onClose, onSave }) => {
  const cleanData: Vehicle = {
    placa: '',
    marcaModelo: '',
    anoFabricacao: '',
    kmAtual: ''
  }

  const [isOpen, setIsOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [customerData, setCustomerData] = useState(cleanData)

  const [errors, setErrors] = useState(cleanData)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    }
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    setIsLoading(false)
    setCustomerData(cleanData)
    setErrors(cleanData)
    onClose()
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setCustomerData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleYearChange = (date: any) => {
    const year = date.format('YYYY')

    setCustomerData(prevData => ({
      ...prevData,
      anoFabricacao: year
    }))
  }

  const validateForm = async () => {
    try {
      const schema = yup.object().shape({
        placa: yup
          .string()
          .min(3, 'Mínimo de 3 caracteres')
          .required('Campo obrigatório'),
        marcaModelo: yup.string().required('Campo obrigatório'),
        kmAtual: yup
          .number()
          .typeError('Deve ser um número')
          .min(0, 'Deve ser maior ou igual a zero')
      })

      await schema.validate(customerData, { abortEarly: false })
      setErrors(cleanData)
      return true
    } catch (validationErrors: any) {
      const errors: any = {}
      validationErrors.inner.forEach((error: any) => {
        errors[error.path] = error.message
      })
      setErrors(errors)
      return false
    }
  }

  const handleSubmit = () => {
    validateForm().then(isValid => {
      if (isValid) {
        setIsLoading(true)
        api
          .post('Veiculo', customerData)
          .then(() => {
            handleClose()
            onSave('Registro salvo com sucesso!', 'success')
          })
          .catch(error => {
            const message = error?.response?.data ?? error?.message
            onSave(
              typeof message === 'string'
                ? message
                : 'An unknown error occurred. Please try again later.',
              'error'
            )
            setIsLoading(false)
          })
      }
    })
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Cadastrar Novo Cliente'}</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '28ch' }
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Placa"
              name="placa"
              type="text"
              value={customerData.placa}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.placa)}
              helperText={errors.placa}
            />
            <TextField
              label="Marca/Modelo"
              name="marcaModelo"
              type="text"
              value={customerData.marcaModelo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.marcaModelo)}
              helperText={errors.marcaModelo}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                views={['year']}
                label="Ano de Fabricação"
                onChange={handleYearChange}
              />
            </LocalizationProvider>
            <TextField
              label="KM Atual"
              name="kmAtual"
              type="number"
              value={customerData.kmAtual}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.kmAtual)}
              helperText={errors.kmAtual}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose} variant="text">
            Cancelar
          </Button>
          <LoadingButton
            loading={isLoading}
            onClick={handleSubmit}
            variant="contained"
          >
            Salvar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { FormVehicle }
