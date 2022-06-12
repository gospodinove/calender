import React, { useCallback, useState } from 'react'
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
import { api } from '../utils/api'
import { isValidEmail, isValidPassword } from '../utils/validation'
import { isEmptyObject } from '../utils/objects'

const AuthModal = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0)

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    errors: {}
  })

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    errors: {}
  })

  const dispatch = useDispatch()

  const getLoginValidationErrors = useCallback(() => {
    const email = loginData.email
    const password = loginData.password

    const errors = {}

    if (!email) {
      errors.email = 'This field is required'
    }

    if (!password) {
      errors.password = 'This field is required'
    }

    if (!errors.email && !isValidEmail(email)) {
      errors.email = 'Enter a valid email'
    }

    return errors
  }, [loginData.email, loginData.password])

  const getRegisterValidationErrors = useCallback(() => {
    const firstName = registerData.firstName
    const lastName = registerData.lastName
    const email = registerData.email
    const password = registerData.password

    const errors = {}

    if (!firstName) {
      errors.firstName = 'This field is required'
    }

    if (!lastName) {
      errors.lastName = 'This field is required'
    }

    if (!email) {
      errors.email = 'This field is required'
    }

    if (!password) {
      errors.password = 'This field is required'
    }

    if (!errors.password && !isValidPassword(password)) {
      errors.password =
        'Min 8 characters (capital & lowercase letter, special character)'
    }

    if (!errors.email && !isValidEmail(email)) {
      errors.email = 'Enter a valid email'
    }

    return errors
  }, [
    registerData.email,
    registerData.password,
    registerData.firstName,
    registerData.lastName
  ])

  const submit = useCallback(async () => {
    switch (tabIndex) {
      case 0: {
        setLoginData({ ...loginData, errors: {} })

        const validationErrors = getLoginValidationErrors()

        if (!isEmptyObject(validationErrors)) {
          setLoginData({ ...loginData, errors: validationErrors })
          break
        }

        const userData = await api('login', 'POST', loginData)
        dispatch({ type: 'user/setToken', payload: userData.token })
        break
      }
      case 1: {
        setRegisterData({ ...registerData, errors: {} })

        const validationErrors = getRegisterValidationErrors()

        if (!isEmptyObject(validationErrors)) {
          setRegisterData({ ...registerData, errors: validationErrors })
          break
        }

        const userData = await api('register', 'POST', registerData)
        dispatch({ type: 'user/setToken', payload: userData.token })
        break
      }
      default:
        console.log('huh?')
        break
    }
  }, [
    loginData,
    registerData,
    tabIndex,
    dispatch,
    getLoginValidationErrors,
    getRegisterValidationErrors
  ])

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
            onChange={event =>
              setLoginData({ ...loginData, email: event.target.value })
            }
            error={loginData.errors.email !== undefined}
            helperText={loginData.errors.email}
            required
          />
          <TextField
            margin="dense"
            id="login-password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={event =>
              setLoginData({ ...loginData, password: event.target.value })
            }
            error={loginData.errors.password !== undefined}
            helperText={loginData.errors.password}
            required
          />
          {/* TODO: Google login */}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <DialogContentText>Create a new account.</DialogContentText>
          <TextField
            margin="dense"
            id="register-name"
            label="First name"
            type="text"
            fullWidth
            variant="standard"
            onChange={event =>
              setRegisterData({
                ...registerData,
                firstName: event.target.value
              })
            }
            error={registerData.errors.firstName !== undefined}
            helperText={registerData.errors.firstName}
            required
          />
          <TextField
            margin="dense"
            id="register-name"
            label="Last name"
            type="text"
            fullWidth
            variant="standard"
            onChange={event =>
              setRegisterData({ ...registerData, lastName: event.target.value })
            }
            error={registerData.errors.lastName !== undefined}
            helperText={registerData.errors.lastName}
            required
          />
          <TextField
            margin="dense"
            id="register-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={event =>
              setRegisterData({ ...registerData, email: event.target.value })
            }
            error={registerData.errors.email !== undefined}
            helperText={registerData.errors.email}
            required
          />
          <TextField
            margin="dense"
            id="register-password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={event =>
              setRegisterData({ ...registerData, password: event.target.value })
            }
            error={registerData.errors.password !== undefined}
            helperText={registerData.errors.password}
            required
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
