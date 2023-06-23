import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../../shared/hooks/useFetch'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { LinearProgress } from '@mui/material'
import {
  CustomNoRowsOverlay,
  Notify,
  NotifyProps
} from '../../shared/components'
import Head from 'next/head'
import { Error as ErrorIcon } from '@mui/icons-material'

interface WeatherForecast {
  date: string
  temperatureC: number
  temperatureF: number
  summary: string
}

const Page: NextPage = () => {
  const cleanNotify: NotifyProps = {
    open: false,
    message: '',
    color: '',
    icon: null
  }

  const [notify, setNotify] = useState<NotifyProps>(cleanNotify)

  const { data, error, isValidating } =
    useFetch<WeatherForecast[]>('WeatherForecast')

  const rows: GridRowsProp =
    data?.map((item, index) => ({
      id: index + 1,
      ...item
    })) || []

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Placa', width: 150, editable: true },
    {
      field: 'temperatureC',
      headerName: 'temperatura °C',
      width: 150,
      editable: true
    },
    {
      field: 'temperatureF',
      headerName: 'temperatura °F',
      align: 'center',
      width: 150,
      editable: true
    },
    {
      field: 'summary',
      headerName: 'Summary',
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
  }, [error])

  const handleCloseNotify = () => {
    setNotify(cleanNotify)
  }

  return (
    <div>
      <Head>
        <title>Previsão do tempo</title>
      </Head>
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
        <div style={{ height: '80vh' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isValidating}
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
