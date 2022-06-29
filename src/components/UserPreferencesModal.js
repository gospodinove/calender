import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { api } from '../utils/api'

const UserPreferencesModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const userPrefs = useSelector(state => state.auth.user?.preferences)

  const [areSharedEventDetailsHidden, setAreSharedEventDetailsHidden] =
    useState(false)

  useEffect(() => {
    setAreSharedEventDetailsHidden(
      userPrefs?.areSharedEventDetailsHidden ? true : false
    )
  }, [userPrefs])

  const onCancelClick = useCallback(() => {
    onClose()
  }, [onClose])

  const onSaveClick = useCallback(async () => {
    try {
      const prefs = { areSharedEventDetailsHidden }

      const response = await api('users/preferences', 'PUT', prefs)

      if (!response.success) {
        dispatch({
          type: 'modals/show',
          payload: {
            modal: 'toast',
            data: { type: 'error', message: 'Could not save' }
          }
        })
        return
      }

      dispatch({
        type: 'auth/updatePrefs',
        payload: prefs
      })

      onClose()
    } catch (err) {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: { type: 'error', message: 'Could not save' }
        }
      })
    }
  }, [areSharedEventDetailsHidden, dispatch, onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={areSharedEventDetailsHidden}
                onChange={e => {
                  console.log(e.target.checked)
                  setAreSharedEventDetailsHidden(e.target.checked)
                }}
              />
            }
            label="Hide events' details when sharing schedule"
          />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelClick}>Cancel</Button>
        <Button onClick={onSaveClick}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

UserPreferencesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default UserPreferencesModal
