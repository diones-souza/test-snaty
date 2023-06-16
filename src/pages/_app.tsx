import React from 'react'
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
import PeopleIcon from '@mui/icons-material/People'
import HomeIcon from '@mui/icons-material/Home'
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

  const [open, setOpen] = React.useState(true)

  const handleDrawer = () => {
    setOpen(!open)
  }

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles)
    }
  }, [])

  const router = useRouter()

  const handleClick = (url: string) => {
    router.push(url)
  }

  const items = [
    {
      name: 'Dasboard',
      icon: <HomeIcon />,
      url: '/'
    },
    {
      name: 'Clients',
      icon: <PeopleIcon />,
      url: '/clients'
    }
  ]

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
                    sx={{ display: 'block' }}
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
                          justifyContent: 'center'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        sx={{ opacity: open ? 1 : 0 }}
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
