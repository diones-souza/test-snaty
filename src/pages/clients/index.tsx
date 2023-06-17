import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../../shared/hooks/useFetch'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { LinearProgress, Stack } from '@mui/material'
import { CustomNoRowsOverlay, Notify, NewClient } from '../../shared/components'
import Head from 'next/head'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface Client {
  id: number
  nome: string
  numeroDocumento: string
  tipoDocumento: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

interface NotifyProps {
  open: boolean
  message: string
  color: string
  icon: any
}

const Clients: NextPage = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const cleanNotify: NotifyProps = {
    open: false,
    message: '',
    color: '',
    icon: null
  }

  const [notify, setNotify] = useState(cleanNotify)

  const { data, error, isValidating } = useFetch<Client[]>('Cliente')

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

  const handleSave = (message: string) => {
    setNotify({
      open: true,
      message,
      color: 'success',
      icon: <CheckCircleIcon />
    })
  }

  const rows: GridRowsProp = data || []

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome' },
    { field: 'numeroDocumento', headerName: 'Numero do Documento', width: 180 },
    { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 150 },
    { field: 'logradouro', headerName: 'Rua' },
    { field: 'numero', headerName: 'Numero' },
    { field: 'bairro', headerName: 'Bairro' },
    { field: 'cidade', headerName: 'Cidade' },
    { field: 'uf', headerName: 'UF' }
  ]

  return (
    <div>
      <Head>
        <title>Clients</title>
      </Head>
      <NewClient
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
        >
          <Button
            onClick={handleOpenDialog}
            sx={{ margin: '8px' }}
            variant="contained"
          >
            Novo Cliente
          </Button>
        </Stack>
        <div style={{ height: '75vh' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isValidating}
            checkboxSelection
            disableSelectionOnClick
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

export default Clients
