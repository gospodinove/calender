import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Tab, Tabs } from '@mui/material'
import TabPanel from './TabPanel'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

const loginUser = async credentials => {
  const data = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  return data.json()
}

const AuthModal = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = React.useState(0)

  const dispatch = useDispatch()

  const submit = async () => {
    switch (tabIndex) {
      case 0:
        const userData = await loginUser({ username: 'asd', password: 'haha' })

        dispatch({ type: 'user/setToken', payload: userData.token })
        break
      case 1:
        console.log('submit register')
        break
      default:
        console.log('huh?')
        break
    }
  }

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TabPanel value={tabIndex} index={0}>
          <DialogContentText>Access your account.</DialogContentText>
          <TextField
            margin="dense"
            id="login-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="login-password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          {/* TODO: Google login */}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <DialogContentText>Create a new account.</DialogContentText>
          <TextField
            margin="dense"
            id="register-name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="register-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="register-password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

AuthModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default AuthModal
