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

const AuthModal = ({ open, onClose }) => {
  const [value, setValue] = React.useState(0)

  const submit = () => {
    switch (value) {
      case 0:
        console.log('submit login')
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
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TabPanel value={value} index={0}>
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

        <TabPanel value={value} index={1}>
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

export default AuthModal
