import React, { useCallback } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { DialogContentText } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { baseUrl } from '../constants'

// TODO: generate the share config
// TODO: hide event details => user pref page

const ShareScheduleModal = ({ open, onClose }) => {
  const data = useSelector(state => state.modals.shareSchedule?.data)

  const onCancelClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Schare your schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can share your {data?.type === 'day' ? 'day' : 'week'} with anyone
          with this link. Then they can book your free time!
        </DialogContentText>
        <DialogContentText>
          You can change your events' details visibility in your preferences.
        </DialogContentText>
        <Button
          variant="outlined"
          endIcon={<ContentCopyIcon />}
          sx={{ width: '100%' }}
        >
          {baseUrl + '/share/config-id'}
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
