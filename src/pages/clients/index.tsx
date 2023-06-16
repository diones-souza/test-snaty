import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../../shared/hooks/useFetch'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { LinearProgress, Stack } from '@mui/material'
import { CustomNoRowsOverlay, Notify } from '../../shared/components'
import Head from 'next/head'
import Button from '@mui/material/Button'

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

const Clients: NextPage = () => {
  const [open, setOpen] = useState(false)
  const { data, error, isValidating } = useFetch<Client[]>('Cliente')

  useEffect(() => {
    if (error) {
      setOpen(true)
    }
  }, [error])

  const rows: GridRowsProp = data || []
  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Name' },
    { field: 'numeroDocumento', headerName: 'Document Number', width: 150 },
    { field: 'tipoDocumento', headerName: 'Document Type', width: 150 },
    { field: 'logradouro', headerName: 'Street' },
    { field: 'numero', headerName: 'Number' },
    { field: 'bairro', headerName: 'District' },
    { field: 'cidade', headerName: 'City' },
    { field: 'uf', headerName: 'State' }
  ]

  return (
    <div>
      <Head>
        <title>Clients</title>
      </Head>
      <div>
        <div>
          <Notify
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={10}
          >
            {error?.message}
          </Notify>
        </div>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          <Button sx={{ margin: '8px' }} variant="contained">
            New Client
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
