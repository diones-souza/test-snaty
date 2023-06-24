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
  Hidden,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Tooltip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Commute as CommuteIcon,
  AccountBox as AccountBoxIcon,
  DirectionsCar as DirectionsCarIcon,
  NightsStay as NightsStayIcon,
  PersonAdd,
  Settings,
  Logout
} from '@mui/icons-material'
import ThemeContainer from '../shared/theme/ThemeContainer'
import createEmotionCache from '../../config/createEmotionCache'
import { DrawerHeader, Drawer } from '../shared/components'
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
      name: 'Dashboard',
      icon: <DashboardIcon />,
      url: '/'
    },
    {
      name: 'Clientes',
      icon: <PeopleIcon />,
      url: '/clients'
    },
    {
      name: 'Veículos',
      icon: <CommuteIcon />,
      url: '/vehicles'
    },
    {
      name: 'Condutores',
      icon: <AccountBoxIcon />,
      url: '/conductors'
    },
    {
      name: 'Deslocamento',
      icon: <DirectionsCarIcon />,
      url: '/displacement'
    },
    {
      name: 'Previsão do tempo',
      icon: <NightsStayIcon />,
      url: '/weatherForecast'
    }
  ]

  const [open, setOpen] = useState<boolean>(true)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

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

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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
              <div style={{ marginLeft: 'auto' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Typography sx={{ minWidth: 100 }}>Contact</Typography>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={openMenu ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src="https://avatars.githubusercontent.com/u/51972715?v=4"
                      ></Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMenu}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
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
