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
import NavBar from '../components/NavBar'
import AuthModal from '../components/AuthModal'

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
  const navigate = useNavigate()
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const [openAuthModal, setOpenAuthModal] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

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
          justifyContent: open ? 'initial' : 'center',
          px: 2.5
        }}
        onClick={() => navigate('/' + item.route)}
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
        <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    ))
  }, [open, navigate])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <NavBar
        open={open}
        onDrawerOpen={handleDrawerOpen}
        onLoginClick={() => setOpenAuthModal(true)}
      />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {useMemo(() => generateMenuItems(open), [open, generateMenuItems])}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>

      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </Box>
  )
}

export default DashboardLayout
