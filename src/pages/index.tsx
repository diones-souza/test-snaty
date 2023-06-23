import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useFetch } from '../shared/hooks/useFetch'
import Head from 'next/head'
import { Chart } from 'react-google-charts'
import {
  Card,
  Unstable_Grid2 as Grid,
  Box,
  Typography,
  CircularProgress,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material'
import {
  MoreVertSharp as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import {
  Client,
  Conductor,
  Vehicle,
  Displacement,
  FormDisplacement,
  Notify,
  NotifyProps
} from '../shared/components'
import { formatDate } from '../shared/utils/helper'
import moment from 'moment'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface Data extends Displacement {
  client?: Client
  conductor?: Conductor
  vehicle?: Vehicle
  type?: string
}

const Dashboard: NextPage = () => {
  const cleanNotify: NotifyProps = {
    open: false,
    message: '',
    color: '',
    icon: null
  }

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [notify, setNotify] = useState<NotifyProps>(cleanNotify)

  const [chartData, setChartData] = useState<any[]>([])

  const [form, setForm] = useState<Data | null>(null)

  const { data: clients, isLoading: clientsIsLoading } =
    useFetch<Client[]>('Cliente')

  const { data: conductors, isLoading: conductorsIsLoading } =
    useFetch<Conductor[]>('Condutor')

  const {
    data: displacements,
    isLoading: displacementsIsLoading,
    mutate: displacementsMutate
  } = useFetch<Data[]>('Deslocamento')

  const { data: vehicles, isLoading: vehiclesIsLoading } =
    useFetch<Vehicle[]>('Veiculo')

  useEffect(() => {
    if (
      !clientsIsLoading &&
      !conductorsIsLoading &&
      !displacementsIsLoading &&
      !vehiclesIsLoading
    ) {
      displacements?.map(item => {
        item.client = clients?.find(({ id }) => id === item.idCliente)
        item.conductor = conductors?.find(({ id }) => id === item.idCondutor)
        item.vehicle = vehicles?.find(({ id }) => id === item.idVeiculo)
        item.type = !item.kmFinal ? 'started' : 'finished'
        return item
      })
    }

    loadChartData()
  }, [
    clientsIsLoading,
    conductorsIsLoading,
    displacementsIsLoading,
    vehiclesIsLoading
  ])

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCloseNotify = () => {
    setNotify(cleanNotify)
  }

  const handleSave = (message: string, status: string) => {
    displacementsMutate()

    loadChartData()

    setNotify({
      open: true,
      message,
      color: status,
      icon: status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />
    })
  }

  const handleEdit = (id: number | null) => {
    const form = displacements?.find(item => item.id === id) ?? null

    setForm(form)

    setOpenDialog(true)
  }

  const loadChartData = () => {
    const data = displacements

    const today = moment().startOf('day')

    let chartData = []

    for (let i = 6; i >= 0; i--) {
      const date = moment(today).subtract(i, 'days')
      const started =
        data?.filter(({ inicioDeslocamento, type }) => {
          return (
            date.isSame(
              moment(
                formatDate(inicioDeslocamento, 'DD/MM/YYYY H:mm:ss'),
                'DD/MM/YYYY H:mm:ss',
                true
              ),
              'day'
            ) && type === 'started'
          )
        }).length ?? 0

      const finished =
        data?.filter(({ inicioDeslocamento, type }) => {
          return (
            date.isSame(
              moment(
                formatDate(inicioDeslocamento, 'DD/MM/YYYY H:mm:ss'),
                'DD/MM/YYYY H:mm:ss',
                true
              ),
              'day'
            ) && type === 'finished'
          )
        }).length ?? 0

      chartData.push({
        day: date.format('DD/MM'),
        started,
        finished
      })
    }

    const dailyData: { [key: string]: any } = chartData?.reduce(
      (result: any, item) => {
        if (!result[item.day]) {
          result[item.day] = {
            ...item
          }
        }

        return result
      },
      {}
    )

    chartData = Object.values(dailyData).map(({ day, started, finished }) => [
      day,
      started,
      finished
    ])

    setChartData([['Dia', 'Em Rota', 'Finalizado'], ...chartData])
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <FormDisplacement
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        form={form}
      />
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
      <Box>
        <Typography variant="h4">Bem-vindo ao Dashboard</Typography>
        <Typography variant="subtitle2">
          Este é o painel de controle para visualizar informações importantes do
          seu aplicativo.
        </Typography>
      </Box>
      <Box
        sx={{
          '& .MuiGrid2-root': { p: 1 }
        }}
      >
        <Grid container>
          <Grid container sx={{ width: isMobile ? '100%' : '70%' }}>
            <Grid xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  height: '150px'
                }}
              >
                <CardHeader
                  action={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={<Typography variant="subtitle1">Clientes</Typography>}
                />
                <Typography variant="h3" align="center" color="#3366cc">
                  {clients?.length}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  height: '150px'
                }}
              >
                <CardHeader
                  action={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={<Typography variant="subtitle1">Veículos</Typography>}
                />
                <Typography variant="h3" align="center" color="#dc3912">
                  {vehicles?.length}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  height: '150px'
                }}
              >
                <div>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={
                      <Typography variant="subtitle1">Condutores</Typography>
                    }
                  />
                  <Typography variant="h3" align="center" color="#ff9900">
                    {conductors?.length}
                  </Typography>
                </div>
              </Card>
            </Grid>
            <Grid xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  height: '350px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Chart
                  width={'100%'}
                  height={'350px'}
                  chartType="ColumnChart"
                  loader={<CircularProgress />}
                  data={chartData}
                  options={{
                    title: 'Registros Diários',
                    isStacked: false,
                    legend: {
                      position: 'bottom'
                    }
                  }}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container sx={{ width: isMobile ? '100%' : '30%' }}>
            <Grid xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  height: '517px'
                }}
              >
                <CardHeader
                  title={<Typography variant="subtitle1">Em rota</Typography>}
                />
                <List>
                  {displacements?.map(
                    item =>
                      !item.kmFinal && (
                        <ListItem
                          key={item.id}
                          secondaryAction={
                            <Tooltip title="Encerrar">
                              <IconButton
                                onClick={() => handleEdit(item.id ?? null)}
                              >
                                <CheckCircleIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          }
                        >
                          <ListItemText
                            primary={item?.conductor?.nome}
                            secondary={`${item?.vehicle?.marcaModelo} - ${item?.vehicle?.anoFabricacao}`}
                          />
                        </ListItem>
                      )
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Dashboard
