import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { AppProps } from 'next/app'
import {
  AppBar,
  Box,
  Toolbar,
  List,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Hidden
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Home as HomeIcon,
  People as PeopleIcon,
  DirectionsCar as DirectionsCarIcon,
  AccountBox as AccountBoxIcon
} from '@mui/icons-material'
import ThemeContainer from '../shared/theme/ThemeContainer'
import createEmotionCache from '../../config/createEmotionCache'
import { DrawerHeader, Drawer } from '../shared/components/Drawer'
import logo from '../assets/images/logo.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const router = useRouter()

  const items = [
    {
      name: 'Home',
      icon: <HomeIcon />,
      url: '/'
    },
    {
      name: 'Clientes',
      icon: <PeopleIcon />,
      url: '/clients'
    },
    {
      name: 'Veículos',
      icon: <DirectionsCarIcon />,
      url: '/vehicles'
    },
    {
      name: 'Condutores',
      icon: <AccountBoxIcon />,
      url: '/conductors'
    }
  ]

  const [open, setOpen] = useState(true)

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles)
    }
  }, [])

  const handleDrawer = () => {
    setOpen(!open)
  }

  const handleClick = (url: string) => {
    router.push(url)
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeContainer>
        <Box sx={{ display: 'flex' }}>
          <AppBar
            position="fixed"
            sx={{
              zIndex: theme => theme.zIndex.drawer + 1
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawer}
                sx={{
                  marginRight: 1
                }}
              >
                <MenuIcon />
              </IconButton>
              <Image width={40} height={40} src={logo}></Image>
            </Toolbar>
          </AppBar>
          <Hidden mdDown={open}>
            <Drawer variant="permanent" open={open}>
              <DrawerHeader />
              <List>
                {items.map(item => (
                  <ListItem
                    key={item.name}
                    disablePadding
                    sx={{
                      display: 'block'
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5
                      }}
                      onClick={() => handleClick(item.url)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color:
                            router.pathname === item.url
                              ? theme => theme.palette.primary.main
                              : 'inherit'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        sx={{
                          opacity: open ? 1 : 0,
                          color:
                            router.pathname === item.url
                              ? theme => theme.palette.primary.main
                              : 'inherit'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </Hidden>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeContainer>
    </CacheProvider>
  )
}

export default MyApp
