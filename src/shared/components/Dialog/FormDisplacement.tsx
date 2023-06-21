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
  Divider,
  Autocomplete,
  Grid
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import * as yup from 'yup'
import api from '../../services/api'
import { Client } from './FormClient'
import { Conductor } from './FormConductor'
import { Vehicle } from './FormVehicle'

export interface Displacement {
  id?: number
  kmInicial?: string
  kmFinal?: string
  inicioDeslocamento?: string
  fimDeslocamento?: string
  checkList?: string
  motivo?: string
  observacao?: string
  idCondutor?: string
  idVeiculo?: string
  idCliente?: string
}

interface Data {
  clients: Client[]
  conductors: Conductor[]
  vehicles: Vehicle[]
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type FormDisplacementProps = PropsWithChildren<DialogProps> & {
  form?: Displacement | null
  onClose: () => void
  onSave: (message: string, status: string) => void
}

const FormDisplacement: NextPage<FormDisplacementProps> = ({
  open,
  form,
  onClose,
  onSave
}) => {
  const cleanData: Displacement = {
    kmInicial: '',
    kmFinal: '',
    inicioDeslocamento: '',
    fimDeslocamento: '',
    checkList: '',
    motivo: '',
    observacao: '',
    idCondutor: '',
    idVeiculo: '',
    idCliente: ''
  }

  const [isOpen, setIsOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState<Data>({
    clients: [],
    conductors: [],
    vehicles: []
  })

  const [customerData, setCustomerData] = useState(cleanData)

  const [errors, setErrors] = useState(cleanData)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
      fetchData()
    }

    if (form) setCustomerData(form)
    else setCustomerData(cleanData)
  }, [open, form])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      const result: Data = data

      await api.get('Cliente').then(({ data }) => {
        result.clients = data
      })

      await api.get('Condutor').then(({ data }) => {
        result.conductors = data
      })

      await api.get('Veiculo').then(({ data }) => {
        result.vehicles = data
      })

      setData(result)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsLoading(false)
    setCustomerData(cleanData)
    setErrors(cleanData)
    onClose()
  }

  const handleAutocompleteChange = (name: string, value: any) => {
    setCustomerData(prevData => ({
      ...prevData,
      [name]: value?.id ?? null
    }))
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target

    setCustomerData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleDateTimeChange = (name: string, value: any) => {
    setCustomerData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const validateForm = async () => {
    try {
      let schema = yup.object().shape({})

      if (!form)
        schema = yup.object().shape({
          kmInicial: yup
            .number()
            .typeError('Deve ser um número')
            .min(0, 'Deve ser maior ou igual a zero'),
          idCondutor: yup
            .number()
            .typeError('Deve ser um número')
            .min(0, 'Deve ser maior ou igual a zero'),
          idVeiculo: yup
            .number()
            .typeError('Deve ser um número')
            .min(0, 'Deve ser maior ou igual a zero'),
          idCliente: yup
            .number()
            .typeError('Deve ser um número')
            .min(0, 'Deve ser maior ou igual a zero')
        })
      else
        schema = yup.object().shape({
          kmFinal: yup
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
        if (!form)
          api
            .post('Deslocamento/IniciarDeslocamento', customerData)
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
        else
          api
            .put(`Deslocamento/${form.id}/EncerrarDeslocamento`, {
              id: customerData.id,
              kmFinal: customerData.kmFinal,
              fimDeslocamento: customerData.fimDeslocamento,
              observacao: customerData.observacao
            })
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
        <DialogTitle>
          {!form ? 'Iniciar Deslocamento' : `Encerrar Deslocamento #${form.id}`}
        </DialogTitle>
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
            {!form ? (
              <Grid container>
                <Grid item xs={6}>
                  <Autocomplete
                    options={data.clients}
                    getOptionLabel={option => `${option?.id} - ${option?.nome}`}
                    onChange={(event, value) =>
                      handleAutocompleteChange('idCliente', value)
                    }
                    renderInput={params => (
                      <TextField {...params} label="Cliente" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={data.conductors}
                    getOptionLabel={option => `${option?.id} - ${option?.nome}`}
                    onChange={(event, value) =>
                      handleAutocompleteChange('idCondutor', value)
                    }
                    renderInput={params => (
                      <TextField {...params} label="Condutor" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={data.vehicles}
                    getOptionLabel={option =>
                      `${option?.id} - ${option?.marcaModelo} ${option?.anoFabricacao}`
                    }
                    onChange={(event, value) =>
                      handleAutocompleteChange('idVeiculo', value)
                    }
                    renderInput={params => (
                      <TextField {...params} label="Veículo" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="KM Inicial"
                    name="kmInicial"
                    type="number"
                    value={customerData.kmInicial}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.kmInicial)}
                    helperText={errors.kmInicial}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      label="Inicio do Deslocamento"
                      onChange={value =>
                        handleDateTimeChange('inicioDeslocamento', value)
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="CheckList"
                    name="checkList"
                    type="text"
                    value={customerData.checkList}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.checkList)}
                    helperText={errors.checkList}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Motivo"
                    name="motivo"
                    type="text"
                    value={customerData.motivo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.motivo)}
                    helperText={errors.motivo}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Observacao"
                    name="observacao"
                    type="text"
                    value={customerData.observacao}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.observacao)}
                    helperText={errors.observacao}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    label="KM Final"
                    name="kmFinal"
                    type="number"
                    value={customerData.kmFinal}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.kmFinal)}
                    helperText={errors.kmFinal}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      label="Fim do Deslocamento"
                      onChange={value =>
                        handleDateTimeChange('fimDeslocamento', value)
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Observacao"
                    name="observacao"
                    type="text"
                    value={customerData.observacao}
                    onChange={handleChange}
                    sx={{ width: '59ch !important' }}
                    margin="normal"
                    error={Boolean(errors.observacao)}
                    helperText={errors.observacao}
                  />
                </Grid>
              </Grid>
            )}
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

export { FormDisplacement }
