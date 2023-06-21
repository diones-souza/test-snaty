import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../../shared/hooks/useFetch'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellEditCommitParams
} from '@mui/x-data-grid'
import { LinearProgress, Stack, Button } from '@mui/material'
import {
  CustomNoRowsOverlay,
  Notify,
  FormVehicle,
  Vehicle
} from '../../shared/components'
import Head from 'next/head'
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material'
import api from '../../shared/services/api'
import { LoadingButton } from '@mui/lab'

interface NotifyProps {
  open: boolean
  message: string
  color: string
  icon: any
}

const Page: NextPage = () => {
  const cleanNotify: NotifyProps = {
    open: false,
    message: '',
    color: '',
    icon: null
  }

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)

  const [notify, setNotify] = useState<NotifyProps>(cleanNotify)

  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const { data, error, isValidating, mutate } = useFetch<Vehicle[]>('Veiculo')

  const rows: GridRowsProp = data || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Código', align: 'center', width: 70 },
    { field: 'placa', headerName: 'Placa', width: 150, editable: true },
    {
      field: 'marcaModelo',
      headerName: 'Marca/Modelo',
      width: 150,
      editable: true
    },
    {
      field: 'anoFabricacao',
      headerName: 'Ano de Fabricação',
      align: 'center',
      width: 150,
      editable: true
    },
    {
      field: 'kmAtual',
      headerName: 'KM Atual',
      align: 'right',
      width: 150,
      editable: true
    }
  ]

  useEffect(() => {
    if (error) {
      setNotify({
        open: true,
        message: error.message,
        color: 'error',
        icon: <ErrorIcon />
      })
    }

    if (openDialog) {
      setOpenDialog(true)
    }
  }, [error, openDialog])

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCloseNotify = () => {
    setNotify(cleanNotify)
  }

  const handleSelectionChange = (selection: any[]) => {
    setSelectedRows(selection)
  }

  const handleSave = (message: string, status: string) => {
    mutate()

    setNotify({
      open: true,
      message,
      color: status,
      icon: status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />
    })
  }

  const handleUpdade = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params

    const row: Vehicle = rows.find(row => row.id === id)

    const updateRow: Vehicle = {
      ...row,
      [field]: value
    }

    api
      .put(`Veiculo/${id}`, updateRow)
      .then(() => {
        mutate()

        setNotify({
          open: true,
          message: 'Registro salvo com sucesso!',
          color: 'success',
          icon: <CheckCircleIcon />
        })
      })
      .catch(error => {
        const message = error?.response?.data ?? error?.message

        setNotify({
          open: true,
          message:
            typeof message === 'string'
              ? message
              : 'An unknown error occurred. Please try again later.',
          color: 'error',
          icon: <ErrorIcon />
        })
      })
  }

  const handleDelete = async () => {
    setIsLoading(true)

    const erros: string[] = []

    for (const id of selectedRows) {
      await api.delete(`Veiculo/${id}`, { data: { id } }).catch(error => {
        const message = error?.response?.data ?? error?.message

        erros.push(
          typeof message === 'string'
            ? message
            : 'An unknown error occurred. Please try again later.'
        )
      })
    }

    if (!erros.length) {
      setNotify({
        open: true,
        message: 'Registro(s) excluído(s) com sucesso',
        color: 'success',
        icon: <CheckCircleIcon />
      })
    } else {
      setNotify({
        open: true,
        message: erros.join(', '),
        color: 'error',
        icon: <ErrorIcon />
      })
    }

    setIsLoading(true)

    mutate()

    setSelectedRows([])
  }

  return (
    <div>
      <Head>
        <title>Veículos</title>
      </Head>
      <FormVehicle
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
      <div>
        <div>
          <Notify
            open={notify.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={10}
            color={notify.color}
            icon={notify.icon}
            onClose={handleCloseNotify}
          >
            <div>{notify.message}</div>
          </Notify>
        </div>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
          sx={{ margin: '8px' }}
        >
          {selectedRows.length > 0 && (
            <LoadingButton
              loading={isLoading}
              onClick={handleDelete}
              variant="contained"
              color="error"
            >
              <DeleteIcon />
              Excluir
            </LoadingButton>
          )}
          <Button onClick={handleOpenDialog} variant="contained">
            <AddIcon />
            Novo
          </Button>
        </Stack>
        <div style={{ height: '75vh' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isValidating}
            disableSelectionOnClick
            checkboxSelection
            onSelectionModelChange={handleSelectionChange}
            selectionModel={selectedRows}
            editMode="cell"
            onCellEditCommit={handleUpdade}
            components={{
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: CustomNoRowsOverlay
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Page
