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
import AuthModal from '../components/AuthModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AppBar,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { api } from '../utils/api'
import CreateEventModal from '../components/CreateEventModal'
import ShareScheduleModal from '../components/ShareScheduleModal'
import UserPreferencesModal from '../components/UserPreferencesModal'

const DashboardLayout = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [userMenuAnchorElement, setUserMenuAnchorElement] = useState(null)

  const user = useSelector(state => state.auth.user)

  const isAuthModalOpen = useSelector(state => state.modals.auth?.open ?? false)
  const setIsAuthModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'auth' }
      }),
    [dispatch]
  )

  const isCreateEventModalOpen = useSelector(
    state => state.modals.createEvent?.open ?? false
  )
  const setIsCreateEventModalOpen = useCallback(
    (open, data) =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'createEvent', data }
      }),
    [dispatch]
  )

  const isShareScheduleModalOpen = useSelector(
    state => state.modals.shareSchedule?.open ?? false
  )
  const setIsShareScheduleModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'shareSchedule' }
      }),
    [dispatch]
  )

  const isUserPreferencesModalOpen = useSelector(
    state => state.modals.userPreferences?.open ?? false
  )
  const setIsUserPreferencesModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'userPreferences' }
      }),
    [dispatch]
  )

  const toastData = useSelector(state => state.modals.toast)
  const hideToast = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'toast' }
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
        setIsAuthModalOpen(true)
        return
      }

      onUserMenuToggle(event)
    },
    [setIsAuthModalOpen, onUserMenuToggle, user]
  )

  const onLogout = useCallback(async () => {
    const response = await api('logout')

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
    setIsUserPreferencesModalOpen(true)
  }, [onUserMenuClose, setIsUserPreferencesModalOpen])

  const container = window !== undefined ? window.document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
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
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            display: { xs: 'block', sm: 'none' },
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
            display: { xs: 'none', sm: 'block' },
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
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CreateEventModal
        open={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />

      <ShareScheduleModal
        open={isShareScheduleModalOpen}
        onClose={() => setIsShareScheduleModalOpen(false)}
      />

      <UserPreferencesModal
        open={isUserPreferencesModalOpen}
        onClose={() => setIsUserPreferencesModalOpen(false)}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={toastData?.open ?? false}
        autoHideDuration={6000}
        onClose={hideToast}
      >
        <Alert
          onClose={hideToast}
          severity={toastData?.data.type}
          sx={{ width: '100%' }}
        >
          {toastData?.data.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DashboardLayout
