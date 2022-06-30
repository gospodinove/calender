import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'
import { Box, CircularProgress, Typography } from '@mui/material'
import { cleanEventData } from '../utils/events'
import { formatReadableDate } from '../utils/formatters'

export default function Shared() {
  const params = useParams()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)

  const calendarRef = useRef(null)

  const [config, setConfig] = useState()
  const [owner, setOwner] = useState()

  const isAuthenticated = useSelector(store => store.auth.user !== undefined)

  const [events, setEvents] = useState([])

  const fetchSharedSchedule = useCallback(async () => {
    try {
      const response = await api('shared', 'GET', {
        configId: params.configId
      })

      if (!response.success) {
        dispatch({
          type: 'modals/show',
          payload: {
            modal: 'toast',
            data: { type: 'error', message: response.messages }
          }
        })
        return
      }

      setOwner(response.data.user)
      setConfig(response.data.config)
      setEvents([...response.data.events, ...response.data.freeSlots])
    } catch {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: { type: 'error', message: 'Could not fetch shared schedule' }
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, params.configId])

  useEffect(() => {
    fetchSharedSchedule()
  }, [fetchSharedSchedule])

  useEffect(() => {
    if (config?.startDate) {
      calendarRef.current.getApi().gotoDate(config.startDate)
    }
  }, [config?.startDate])

  const onTimeSelected = useCallback(
    eventData => {
      if (!isAuthenticated) {
        dispatch({
          type: 'modals/show',
          payload: { modal: 'auth' }
        })
        return
      }

      dispatch({
        type: 'modals/show',
        payload: { modal: 'createEvent', data: cleanEventData(eventData) }
      })
    },
    [dispatch, isAuthenticated]
  )

  const getTitle = useCallback(() => {
    if (!owner || !config) {
      return ''
    }

    const range =
      config.type === 'day'
        ? formatReadableDate(new Date(config.startDate))
        : formatReadableDate(new Date(config.startDate)) +
          ' - ' +
          formatReadableDate(new Date(config.endDate))

    return (
      owner.firstName +
      (owner.firstName[owner.firstName.length - 1] === 's' ? "'" : "'s") +
      ' shared schedule for ' +
      range
    )
  }, [config, owner])

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {getTitle()}
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box sx={{ maxWidth: config?.type === 'day' ? '50%' : '70%' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView={
                config?.type === 'day' ? 'timeGridDay' : 'timeGridWeek'
              }
              allDaySlot={false}
              height="auto"
              nowIndicator
              selectable
              select={onTimeSelected}
              events={events}
              headerToolbar={false}
              dayHeaders={config?.type === 'week'}
              eventColor={
                owner?.preferences.areSharedEventDetailsHidden
                  ? 'grey'
                  : undefined
              }
              eventTextColor={
                owner?.preferences.areSharedEventDetailsHidden
                  ? 'grey'
                  : undefined
              }
              selectConstraint="freeSlot"
              firstDay={1}
            />
          )}
        </Box>
      </Box>
    </>
  )
}
