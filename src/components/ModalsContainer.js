import { Alert, Snackbar } from '@mui/material'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from './AuthModal'
import CreateEventModal from './CreateEventModal'
import ShareScheduleModal from './ShareScheduleModal'
import UserPreferencesModal from './UserPreferencesModal'

const ModalsContainer = () => {
  const dispatch = useDispatch()

  const isAuthModalOpen = useSelector(state => state.modals.auth?.open ?? false)
  const setIsAuthModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'auth' }
      }),
    [dispatch]
  )

  const isCreateEventModalOpen = useSelector(
    state => state.modals.createEvent?.open ?? false
  )
  const setIsCreateEventModalOpen = useCallback(
    (open, data) =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'createEvent', data }
      }),
    [dispatch]
  )

  const isShareScheduleModalOpen = useSelector(
    state => state.modals.shareSchedule?.open ?? false
  )
  const setIsShareScheduleModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
        payload: { modal: 'shareSchedule' }
      }),
    [dispatch]
  )

  const isUserPreferencesModalOpen = useSelector(
    state => state.modals.userPreferences?.open ?? false
  )
  const setIsUserPreferencesModalOpen = useCallback(
    open =>
      dispatch({
        type: `modals/${open ? 'show' : 'hide'}`,
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
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CreateEventModal
        open={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />

      <ShareScheduleModal
        open={isShareScheduleModalOpen}
        onClose={() => setIsShareScheduleModalOpen(false)}
      />

      <UserPreferencesModal
        open={isUserPreferencesModalOpen}
        onClose={() => setIsUserPreferencesModalOpen(false)}
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
