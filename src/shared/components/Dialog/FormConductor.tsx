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

export interface Conductor {
  id?: number
  nome: string
  numeroHabilitacao: string
  categoriaHabilitacao: string
  vencimentoHabilitacao: string
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

const FormConductor: NextPage<FormClientProps> = ({
  open,
  onClose,
  onSave
}) => {
  const cleanData: Conductor = {
    nome: '',
    numeroHabilitacao: '',
    categoriaHabilitacao: '',
    vencimentoHabilitacao: ''
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

  const handleDateChange = (date: any) => {
    const year = date.format('YYYY-MM-DD')

    setCustomerData(prevData => ({
      ...prevData,
      vencimentoHabilitacao: year
    }))
  }

  const validateForm = async () => {
    try {
      const schema = yup.object().shape({
        nome: yup
          .string()
          .min(3, 'Mínimo de 3 caracteres')
          .required('Campo obrigatório'),
        numeroHabilitacao: yup
          .string()
          .matches(/^\d+$/, 'Deve conter apenas números')
          .required('Campo obrigatório'),
        categoriaHabilitacao: yup
          .string()
          .max(2, 'Máximo de 2 caracteres')
          .required('Campo obrigatório')
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
          .post('Condutor', customerData)
          .then(() => {
            handleClose()
            onSave('Registro salvo com sucesso!', 'success')
          })
          .catch(error => {
            onSave(error?.response?.data || error?.message, 'error')
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
              label="Nome"
              name="nome"
              type="text"
              value={customerData.nome}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.nome)}
              helperText={errors.nome}
            />
            <TextField
              label="Numero Habilitação"
              name="numeroHabilitacao"
              type="text"
              value={customerData.numeroHabilitacao}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.numeroHabilitacao)}
              helperText={errors.numeroHabilitacao}
            />
            <TextField
              label="Categoria Habilitação"
              name="categoriaHabilitacao"
              type="text"
              value={customerData.categoriaHabilitacao}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.categoriaHabilitacao)}
              helperText={errors.categoriaHabilitacao}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Vencimento Habilitação"
                onChange={handleDateChange}
              />
            </LocalizationProvider>
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

export { FormConductor }
