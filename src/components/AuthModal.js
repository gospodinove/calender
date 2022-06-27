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

const loginDataInitialState = {
  email: '',
  password: '',
  errors: {}
}

const registerDataInitialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  errors: {}
}

const AuthModal = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0)

  const [loginData, setLoginData] = useState(loginDataInitialState)
  const [registerData, setRegisterData] = useState(registerDataInitialState)

  const dispatch = useDispatch()

  const submitLogin = useCallback(async () => {
    setLoginData({ ...loginData, errors: {} })

    const response = await api('login', 'POST', loginData)

    if (!response.success) {
      switch (response.messageType) {
        case 'field-error':
          setLoginData({
            ...loginData,
            errors: response.messages
          })
          break

        case 'general':
          dispatch({
            type: 'modals/show',
            payload: {
              modal: 'toast',
              data: { type: 'error', message: response.messages }
            }
          })
          break

        default:
          break
      }
      throw new Error()
    }

    dispatch({ type: 'auth/setUser', payload: response.user })
  }, [dispatch, loginData])

  const submitRegister = useCallback(async () => {
    setRegisterData({ ...registerData, errors: {} })

    const response = await api('register', 'POST', registerData)

    if (!response.success) {
      switch (response.messageType) {
        case 'field-error':
          setRegisterData({
            ...registerData,
            errors: response.messages
          })
          break

        case 'general':
          dispatch({
            type: 'modals/show',
            payload: {
              modal: 'toast',
              data: { type: 'error', message: response.messages }
            }
          })
          break

        default:
          break
      }
      throw new Error()
    }

    dispatch({ type: 'auth/setUser', payload: response.user })
  }, [dispatch, registerData])

  const submit = useCallback(async () => {
    try {
      switch (tabIndex) {
        case 0: {
          await submitLogin()
          onClose()
          break
        }
        case 1: {
          await submitRegister()
          onClose()
          break
        }
        default:
          console.log('huh?')
          break
      }
    } catch (err) {
      console.log(err)
    }
  }, [submitLogin, submitRegister, tabIndex, onClose])

  const clearTabData = useCallback(() => {
    setLoginData(loginDataInitialState)
    setRegisterData(registerDataInitialState)
  }, [])

  const onCancelClick = useCallback(() => {
    clearTabData()
    onClose()
  }, [clearTabData, onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => {
              setTabIndex(newValue)
              clearTabData()
            }}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>
      </DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          submit()
        }}
      >
        <DialogContent>
          <TabPanel value={tabIndex} index={0}>
            <DialogContentText>Access your account.</DialogContentText>
            <TextField
              margin="dense"
              id="login-email"
              label="Email Address"
              type="email"
              fullWidth
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
              onChange={event =>
                setRegisterData({
                  ...registerData,
                  lastName: event.target.value
                })
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
              onChange={event =>
                setRegisterData({
                  ...registerData,
                  password: event.target.value
                })
              }
              error={registerData.errors.password !== undefined}
              helperText={registerData.errors.password}
              required
            />
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancelClick}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

AuthModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default AuthModal
