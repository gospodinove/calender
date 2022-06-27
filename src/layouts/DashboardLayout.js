import React, { useCallback, useMemo, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ViewDayIcon from '@mui/icons-material/ViewDay'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
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

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}))

const DashboardLayout = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const theme = useTheme()
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

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

  const generateMenuItems = useCallback(() => {
    const items = [
      { title: 'Day', icon: <ViewDayIcon />, route: 'day' },
      { title: 'Week', icon: <ViewWeekIcon />, route: 'week' },
      { title: 'List', icon: <ListIcon />, route: 'list' },
      { title: 'Teams', icon: <TeamIcon />, route: 'teams' }
    ]

    return items.map(item => (
      <ListItemButton
        key={item.route}
        sx={{
          minHeight: 48,
          justifyContent: isDrawerOpen ? 'initial' : 'center',
          px: 2.5
        }}
        onClick={() => navigate('/' + item.route)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isDrawerOpen ? 3 : 'auto',
            justifyContent: 'center'
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          sx={{ opacity: isDrawerOpen ? 1 : 0 }}
        />
      </ListItemButton>
    ))
  }, [isDrawerOpen, navigate])

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
      // TODO: Show a toast with error
      console.log(response.error)
      return
    }

    dispatch({ type: 'auth/setUser', payload: undefined })
  }, [dispatch, onUserMenuClose])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={isDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(isDrawerOpen && { display: 'none' })
            }}
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
            <MenuItem onClick={onUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={onUserMenuClose}>My account</MenuItem>
            <MenuItem onClick={onLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={isDrawerOpen}>
        <DrawerHeader>
          <IconButton onClick={onDrawerToggle}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {useMemo(
            () => generateMenuItems(isDrawerOpen),
            [isDrawerOpen, generateMenuItems]
          )}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
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
