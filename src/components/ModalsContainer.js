import { Alert, Snackbar } from '@mui/material'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from './AuthModal'
import EventDetailsInteractionModal from './EventDetailsInteractionModal'
import ShareScheduleModal from './ShareScheduleModal'
import UserPreferencesModal from './UserPreferencesModal'

const ModalsContainer = () => {
  const dispatch = useDispatch()

  const isAuthModalOpen = useSelector(state => state.modals.auth?.open ?? false)
  const closeIsAuthModal = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'auth' }
      }),
    [dispatch]
  )

  const isEventDetailsInteractionModalOpen = useSelector(
    state => state.modals.eventDetailsInteraction?.open ?? false
  )
  const closeEventDetailsInteractionModal = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'eventDetailsInteraction' }
      }),
    [dispatch]
  )

  const isShareScheduleModalOpen = useSelector(
    state => state.modals.shareSchedule?.open ?? false
  )
  const closeShareScheduleModal = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'shareSchedule' }
      }),
    [dispatch]
  )

  const isUserPreferencesModalOpen = useSelector(
    state => state.modals.userPreferences?.open ?? false
  )
  const closeUserPreferencesModal = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'userPreferences' }
      }),
    [dispatch]
  )

  const toastData = useSelector(state => state.modals.toast)
  const hideToast = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { modal: 'toast' }
      }),
    [dispatch]
  )

  return (
    <>
      <AuthModal open={isAuthModalOpen} onClose={closeIsAuthModal} />

      <EventDetailsInteractionModal
        open={isEventDetailsInteractionModalOpen}
        onClose={closeEventDetailsInteractionModal}
      />

      <ShareScheduleModal
        open={isShareScheduleModalOpen}
        onClose={closeShareScheduleModal}
      />

      <UserPreferencesModal
        open={isUserPreferencesModalOpen}
        onClose={closeUserPreferencesModal}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={toastData?.open ?? false}
        autoHideDuration={6000}
        onClose={hideToast}
      >
        <Alert
          onClose={hideToast}
          severity={toastData?.data.type}
          sx={{ width: '100%' }}
        >
          {toastData?.data.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ModalsContainer
