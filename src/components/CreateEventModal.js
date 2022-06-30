import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import Grid from '@mui/material/Grid'
import { api } from '../utils/api'
import { Typography } from '@mui/material'

const CreateEventModal = ({ open, onClose }) => {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.createEvent?.data)
  const user = useSelector(store => store.auth.user)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)

  const [name, setName] = useState()
  const [email, setEmail] = useState()

  const [errors, setErrors] = useState({})

  useEffect(() => {
    setStart(initialData ? new Date(initialData.start) : null)
    setEnd(initialData ? new Date(initialData?.end) : null)
    setName(user ? user.firstName + ' ' + user.lastName : '')
    setEmail(user ? user.email : '')
  }, [initialData, user])

  const submit = useCallback(async () => {
    try {
      const response = await api('events', 'POST', {
        title,
        description,
        start,
        end,
        isShared: initialData?.isShared,
        name,
        email,
        scheduleOwnerId: initialData?.scheduleOwnerId
      })

      if (!response.success) {
        switch (response.messageType) {
          case 'field-error':
            setErrors(response.messages)
            return

          case 'general':
            dispatch({
              type: 'modals/show',
              payload: {
                modal: 'toast',
                data: { type: 'error', message: response.messages }
              }
            })
            return

          default:
            return
        }
      }

      // in case of a multiday event an array of events is created and returned
      const payload = response.events ? response.events : response.event

      if (response.isShared) {
        dispatch({ type: 'sharedConfig/setShouldFetch', payload: true })
      } else {
        dispatch({ type: 'events/add', payload })
      }

      onClose()
    } catch (err) {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: { type: 'error', message: 'Could not create event' }
        }
      })
    }
  }, [
    title,
    description,
    start,
    end,
    dispatch,
    onClose,
    setErrors,
    initialData?.scheduleOwnerId,
    email,
    initialData?.isShared,
    name
  ])

  const onCancelClick = useCallback(() => {
    setErrors({})
    onClose()
  }, [setErrors, onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Create event</DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          submit()
        }}
      >
        <DialogContent>
          <TextField
            margin="dense"
            id="event-name"
            label="Title"
            type="text"
            fullWidth
            onChange={event => setTitle(event.target.value)}
            error={errors.title !== undefined}
            helperText={errors.title}
            required
          />

          <TextField
            margin="dense"
            multiline
            minRows={2}
            maxRows={3}
            id="event-description"
            label="Description"
            type="text"
            fullWidth
            onChange={event => setDescription(event.target.value)}
            error={errors.description !== undefined}
            helperText={errors.description}
          />

          <Grid container spacing={1} sx={{ marginTop: '10px' }}>
            <Grid item xs>
              <DateTimePicker
                renderInput={props => (
                  <TextField
                    {...props}
                    sx={{ width: '100%' }}
                    error={errors.start !== undefined}
                    helperText={errors.start}
                  />
                )}
                label="Start"
                value={start}
                onChange={newValue => setStart(newValue)}
              />
            </Grid>
            <Grid item xs>
              <DateTimePicker
                renderInput={props => (
                  <TextField
                    {...props}
                    sx={{ width: '100%' }}
                    error={errors.end !== undefined}
                    helperText={errors.end}
                  />
                )}
                label="End"
                value={end}
                onChange={newValue => setEnd(newValue)}
              />
            </Grid>
          </Grid>

          {initialData?.isShared ? (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Your information
              </Typography>

              <TextField
                margin="dense"
                type="text"
                label={user ? undefined : 'Name'}
                fullWidth
                value={name}
                onChange={event => setName(event.target.value)}
                disabled={user ? true : false}
                error={errors.name !== undefined}
                helperText={errors.name}
              />
              <TextField
                margin="dense"
                type="text"
                label={user ? undefined : 'Email'}
                fullWidth
                value={email}
                onChange={event => setEmail(event.target.value)}
                disabled={user ? true : false}
                error={errors.email !== undefined}
                helperText={errors.email}
              />
            </>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancelClick}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

CreateEventModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default CreateEventModal
