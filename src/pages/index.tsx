import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Chart } from 'react-google-charts'
import moment from 'moment'
import { Card, Grid, Box, Typography, LinearProgress } from '@mui/material'

interface DailyData {
  day: string
  Clientes: number
  Veículos: number
  Condutores: number
  Deslocamentos: number
}

const Dashboard: NextPage = () => {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const getDailyData = () => {
      // Dados fictícios para exemplo
      const data = [
        { tipo: 'Clientes', dataRegistro: '2023-06-01' },
        { tipo: 'Clientes', dataRegistro: '2023-06-01' },
        { tipo: 'Veículos', dataRegistro: '2023-06-01' },
        { tipo: 'Condutores', dataRegistro: '2023-06-02' },
        { tipo: 'Clientes', dataRegistro: '2023-06-02' },
        { tipo: 'Deslocamentos', dataRegistro: '2023-06-02' },
        { tipo: 'Veículos', dataRegistro: '2023-06-03' },
        { tipo: 'Deslocamentos', dataRegistro: '2023-06-03' }
      ]

      const dailyData: { [key: string]: DailyData } = data.reduce(
        (result: any, item) => {
          const day = moment(item.dataRegistro).format('YYYY-MM-DD')
          if (!result[day]) {
            result[day] = {
              day,
              Clientes: 0,
              Veículos: 0,
              Condutores: 0,
              Deslocamentos: 0
            }
          }
          result[day][item.tipo] += 1
          return result
        },
        {}
      )

      const chartData = Object.values(dailyData).map(
        ({ day, Clientes, Veículos, Condutores, Deslocamentos }) => [
          day,
          Clientes,
          Veículos,
          Condutores,
          Deslocamentos
        ]
      )

      setChartData([
        ['Dia', 'Clientes', 'Veículos', 'Condutores', 'Deslocamentos'],
        ...chartData
      ])
    }

    getDailyData()
  }, [])

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box>
        <Typography variant="h4">Bem-vindo ao Dashboard</Typography>
        <Typography variant="subtitle2">
          Este é o painel de controle para visualizar informações importantes do
          seu aplicativo.
        </Typography>
      </Box>
      <Box
        sx={{
          '& .MuiGrid-root': { p: 1 }
        }}
      >
        <Grid container>
          <Grid container xs={9}>
            <Grid item xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  minHeight: '150px'
                }}
              ></Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  minHeight: '150px'
                }}
              ></Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  minHeight: '150px'
                }}
              ></Card>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important'
                }}
              >
                <Chart
                  height={'350px'}
                  chartType="ColumnChart"
                  loader={<LinearProgress />}
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
          <Grid container xs={3}>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important',
                  minHeight: '517px'
                }}
              ></Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Dashboard
