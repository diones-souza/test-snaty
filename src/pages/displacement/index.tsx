import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../../shared/hooks/useFetch'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueGetterParams
} from '@mui/x-data-grid'
import { LinearProgress, Stack, Button } from '@mui/material'
import {
  CustomNoRowsOverlay,
  Notify,
  FormDisplacement,
  Displacement
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
import { formatDate } from '../../shared/utils/helper'

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

  const [selected, setSelected] = useState<Displacement | null>(null)

  const [form, setForm] = useState<Displacement | null>(null)

  const { data, error, isValidating, mutate } =
    useFetch<Displacement[]>('Deslocamento')

  const rows: GridRowsProp =
    data?.map(item => {
      item.inicioDeslocamento = formatDate(
        item.inicioDeslocamento,
        'DD/MM/YYYY H:mm:ss'
      )

      item.fimDeslocamento = formatDate(
        item.fimDeslocamento,
        'DD/MM/YYYY H:mm:ss'
      )

      return item
    }) || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Código', align: 'center', width: 70 },
    {
      field: 'kmInicial',
      headerName: 'KM Inicial',
      align: 'center',
      width: 150
    },
    {
      field: 'kmFinal',
      headerName: 'KM Final',
      align: 'center',
      width: 150
    },
    {
      field: 'inicioDeslocamento',
      headerName: 'Início do Deslocamento',
      align: 'center',
      width: 200
    },
    {
      field: 'fimDeslocamento',
      headerName: 'Fim do Deslocamento',
      align: 'center',
      width: 200
    },
    {
      field: 'checkList',
      headerName: 'CheckList'
    },
    {
      field: 'observacao',
      headerName: 'Observacao.'
    },
    {
      field: 'idCondutor',
      headerName: 'Código do Condutor.',
      align: 'center'
    },
    {
      field: 'idVeiculo',
      headerName: 'Código do Veículos .',
      align: 'center'
    },
    {
      field: 'idCliente',
      headerName: 'Código do Cliente.',
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        !params.row.kmFinal && (
          <Button
            onClick={() => handleEdit(params.row.id)}
            variant="outlined"
            startIcon={<CheckCircleIcon />}
          >
            Encerrar
          </Button>
        )
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

  const handleOpenDialog = (type?: string) => {
    if (type === 'new') setForm(null)

    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCloseNotify = () => {
    setNotify(cleanNotify)
  }

  const handleSelectionChange = (selection: any[]) => {
    if (selection.length === 1) {
      const id = selection.find(item => item)

      const selected: Displacement = rows.find(
        item => item.id === id && !item.kmFinal
      )

      if (selected) setSelected(selected)
      else setSelected(null)
    } else setSelected(null)
    setSelectedRows(selection)
  }

  const handleSave = (message: string, status: string) => {
    setSelected(null)

    mutate()

    setNotify({
      open: true,
      message,
      color: status,
      icon: status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />
    })
  }

  const handleEdit = (id: number) => {
    const form = rows.find(item => item.id === id)

    setForm(form)

    setOpenDialog(true)
  }

  const handleDelete = async () => {
    setIsLoading(true)

    const erros: string[] = []

    for (const id of selectedRows) {
      await api.delete(`Deslocamento/${id}`, { data: { id } }).catch(error => {
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

    setIsLoading(false)

    mutate()

    setSelectedRows([])
  }

  return (
    <div>
      <Head>
        <title>Deslocamentos</title>
      </Head>
      <FormDisplacement
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        form={form}
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
          {selected && (
            <Button
              onClick={() => handleEdit(selectedRows.find(item => item))}
              variant="outlined"
              startIcon={<CheckCircleIcon />}
            >
              Encerrar
            </Button>
          )}
          {selectedRows.length > 0 && (
            <LoadingButton
              loading={isLoading}
              onClick={handleDelete}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Excluir
            </LoadingButton>
          )}
          <Button
            onClick={() => handleOpenDialog('new')}
            variant="contained"
            startIcon={<AddIcon />}
          >
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
