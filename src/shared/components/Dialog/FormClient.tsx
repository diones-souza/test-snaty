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
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import * as yup from 'yup'
import api from '../../services/api'

export interface Client {
  id?: number
  nome: string
  numeroDocumento: string
  tipoDocumento: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
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

const FormClient: NextPage<FormClientProps> = ({ open, onClose, onSave }) => {
  const cleanData: Client = {
    nome: '',
    numeroDocumento: '',
    tipoDocumento: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
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

  const validateForm = async () => {
    try {
      const schema = yup.object().shape({
        nome: yup
          .string()
          .min(3, 'Mínimo de 3 caracteres')
          .required('Campo obrigatório'),
        numeroDocumento: yup
          .string()
          .matches(/^\d+$/, 'Deve conter apenas números')
          .required('Campo obrigatório'),
        tipoDocumento: yup.string().required('Campo obrigatório'),
        uf: yup
          .string()
          .max(2, 'Máximo 2 caracteres')
          .matches(/^[a-zA-Z\s]*$/, 'Deve conter apenas letras')
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
          .post('Cliente', customerData)
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
              label="Número Documento"
              name="numeroDocumento"
              type="text"
              value={customerData.numeroDocumento}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.numeroDocumento)}
              helperText={errors.numeroDocumento}
            />
            <TextField
              label="Tipo Documento"
              name="tipoDocumento"
              type="text"
              value={customerData.tipoDocumento}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.tipoDocumento)}
              helperText={errors.tipoDocumento}
            />
            <TextField
              label="Logradouro"
              name="logradouro"
              type="text"
              value={customerData.logradouro}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Número"
              name="numero"
              type="text"
              value={customerData.numero}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bairro"
              name="bairro"
              type="text"
              value={customerData.bairro}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cidade"
              name="cidade"
              type="text"
              value={customerData.cidade}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="UF"
              name="uf"
              type="text"
              value={customerData.uf}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.uf)}
              helperText={errors.uf}
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

export { FormClient }
