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

const CreateEventModal = ({ open, onClose }) => {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.createEvent?.data)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    setStart(initialData ? new Date(initialData.start) : null)
    setEnd(initialData ? new Date(initialData?.end) : null)
  }, [initialData])

  const submit = useCallback(async () => {
    try {
      const response = await api('events', 'POST', {
        title,
        description,
        start,
        end
      })

      if (!response.success) {
        switch (response.messageType) {
          case 'validation-error':
            setErrors(response.messages)
            return

          default:
            return
        }
      }

      dispatch({ type: 'events/add', payload: response.event })

      onClose()
    } catch (err) {
      console.log(err)
    }
  }, [title, description, start, end, dispatch, onClose, setErrors])

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
            label="Name"
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
