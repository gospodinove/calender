import React, { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import ViewDayIcon from '@mui/icons-material/ViewDay'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListIcon from '@mui/icons-material/ListAlt'
import TeamIcon from '@mui/icons-material/Group'
import { Outlet, useNavigate } from 'react-router-dom'
import { drawerWidth } from '../utils/layout'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { api } from '../utils/api'
import ModalsContainer from '../components/ModalsContainer'

const MainLayout = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [userMenuAnchorElement, setUserMenuAnchorElement] = useState(null)

  const user = useSelector(state => state.auth.user)

  const openAuthModal = useCallback(
    () =>
      dispatch({
        type: 'modals/show',
        payload: { modal: 'auth' }
      }),
    [dispatch]
  )

  const openUserPreferencesModal = useCallback(
    () =>
      dispatch({
        type: 'modals/show',
        payload: { modal: 'userPreferences' }
      }),
    [dispatch]
  )

  const onDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setIsDrawerOpen])

  const onUserMenuToggle = useCallback(
    event => {
      setUserMenuAnchorElement(event.currentTarget)
    },
    [setUserMenuAnchorElement]
  )

  const onUserMenuClose = useCallback(() => {
    setUserMenuAnchorElement(null)
  }, [setUserMenuAnchorElement])

  const generateDrawerContent = useCallback(() => {
    const items = [
      { title: 'Day', icon: <ViewDayIcon />, route: 'day' },
      { title: 'Week', icon: <ViewWeekIcon />, route: 'week' },
      // TODO: List view
      { title: 'List', icon: <ListIcon />, route: 'list' },
      { title: 'Teams', icon: <TeamIcon />, route: 'teams' }
    ]

    return (
      <List>
        <Toolbar />
        {items.map(item => (
          <ListItemButton
            key={item.route}
            sx={{
              minHeight: 48,
              justifyContent: 'initial',
              px: 2.5
            }}
            onClick={() => navigate('/' + item.route)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ opacity: 1 }} />
          </ListItemButton>
        ))}
      </List>
    )
  }, [navigate])

  const onUserMenuClick = useCallback(
    event => {
      if (!user) {
        openAuthModal()
        return
      }

      onUserMenuToggle(event)
    },
    [openAuthModal, onUserMenuToggle, user]
  )

  const onLogout = useCallback(async () => {
    const response = await api('logout')

    dispatch({ type: 'auth/clear' })
    dispatch({ type: 'events/clear' })
    dispatch({ type: 'sharedConfig/clear' })

    onUserMenuClose()

    if (!response.success) {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: { type: 'error', message: 'Could not logout' }
        }
      })
      return
    }

    dispatch({ type: 'auth/setUser', payload: undefined })
  }, [dispatch, onUserMenuClose])

  const onPreferencesClick = useCallback(() => {
    onUserMenuClose()
    openUserPreferencesModal()
  }, [onUserMenuClose, openUserPreferencesModal])

  const container = window !== undefined ? window.document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            CaLender
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onUserMenuClick}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={userMenuAnchorElement}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={userMenuAnchorElement !== null}
            onClose={onUserMenuClose}
          >
            <MenuItem onClick={onPreferencesClick}>Preferences</MenuItem>
            <MenuItem onClick={onLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={isDrawerOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {generateDrawerContent()}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {generateDrawerContent()}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <ModalsContainer />
    </Box>
  )
}

export default MainLayout
