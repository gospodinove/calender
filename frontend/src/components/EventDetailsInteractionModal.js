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
import { Box, Divider, Typography } from '@mui/material'

const EventDetailsInteractionModal = ({ open, onClose }) => {
  const dispatch = useDispatch()

  const initialData = useSelector(
    state => state.modals.eventDetailsInteraction?.data.data
  )
  const interactionType = useSelector(
    state => state.modals.eventDetailsInteraction?.data.type
  )

  const user = useSelector(store => store.auth.user)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)

  const [name, setName] = useState()
  const [email, setEmail] = useState()

  const [errors, setErrors] = useState({})

  const isShared =
    interactionType === 'edit'
      ? initialData?.sharedData !== null &&
        initialData?.sharedData !== undefined
      : initialData?.isShared && initialData?.scheduleOwnerId !== user?.id

  useEffect(() => {
    setStart(initialData ? new Date(initialData.start) : null)
    setEnd(initialData ? new Date(initialData.end) : null)

    setTitle(interactionType === 'edit' ? initialData?.title ?? '' : '')
    setDescription(
      interactionType === 'edit' ? initialData?.description ?? '' : ''
    )

    setName(user ? user.firstName + ' ' + user.lastName : '')
    setEmail(user ? user.email : '')
  }, [initialData, user, interactionType])

  const submit = useCallback(async () => {
    try {
      const payload = {
        title,
        description,
        start,
        end,
        isShared,
        name,
        email,
        scheduleOwnerId: initialData?.scheduleOwnerId,
        id: interactionType === 'edit' ? initialData?.id : undefined
      }

      const response = await api(
        'events',
        interactionType === 'create' ? 'POST' : 'PUT',
        payload
      )

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

      switch (interactionType) {
        case 'create':
          // in case of a multiday event an array of events is created and returned
          const payload = response.events ? response.events : response.event

          if (initialData?.isShared) {
            dispatch({ type: 'sharedConfig/setShouldFetch', payload: true })
          } else {
            dispatch({ type: 'events/add', payload })
          }
          break

        case 'edit':
          dispatch({
            type: 'events/update',
            payload: {
              id: initialData?.id,
              title,
              description,
              start: start.toISOString(),
              end: end.toISOString()
            }
          })
          break

        default:
          break
      }

      onClose()
    } catch (err) {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: {
            type: 'error',
            message: `Could not ${
              interactionType === 'create' ? 'create' : 'udpate'
            } event`
          }
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
    initialData,
    email,
    isShared,
    name,
    interactionType
  ])

  const onCancelClick = useCallback(() => {
    setErrors({})
    onClose()
  }, [setErrors, onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>
        {`${interactionType === 'create' ? 'Create' : 'Edit'} event`}
      </DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          submit()
        }}
      >
        <DialogContent>
          {isShared && user && interactionType === 'create' ? (
            <Typography mb={3}>
              This event will appear in your schedule as well
            </Typography>
          ) : null}

          <TextField
            margin="dense"
            id="event-name"
            label="Title"
            type="text"
            fullWidth
            value={title}
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
            value={description}
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
                disabled={isShared}
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
                disabled={isShared}
              />
            </Grid>
          </Grid>

          {isShared ? (
            <Box>
              <Divider sx={{ mt: 3, mb: 1 }}>Your information</Divider>

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
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancelClick}>Cancel</Button>
          <Button type="submit">
            {interactionType === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

EventDetailsInteractionModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default EventDetailsInteractionModal
