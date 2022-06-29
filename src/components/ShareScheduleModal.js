import React, { useCallback } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { DialogContentText } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { baseUrl } from '../constants'

// TODO: hide event details => user pref page

const ShareScheduleModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.modals.shareSchedule?.data)

  const url = baseUrl + '/shared/' + data?.configId

  const onCopyClick = useCallback(() => {
    navigator.clipboard.writeText(url)

    dispatch({
      type: 'modals/show',
      payload: {
        modal: 'toast',
        data: { type: 'success', message: 'Copied to clipboard' }
      }
    })
  }, [url, dispatch])

  const onCancelClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Schare your schedule</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>
          You can share your {data?.type === 'day' ? 'day' : 'week'} with anyone
          with this link. Then they can book your free time!
        </DialogContentText>
        <DialogContentText sx={{ mb: 1 }}>
          You can change your events' details visibility in your preferences.
        </DialogContentText>
        <Button
          variant="outlined"
          endIcon={<ContentCopyIcon />}
          sx={{ width: '100%' }}
          onClick={onCopyClick}
        >
          {url}
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelClick}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

ShareScheduleModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default ShareScheduleModal
