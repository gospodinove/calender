import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { cleanEventData, parseEventClickData } from '../utils/events'
import { formatReadableDate } from '../utils/formatters'
import Event from '../components/Event'

export default function Shared() {
  const params = useParams()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState()

  const userId = useSelector(state => state.auth.user?.id)

  const calendarRef = useRef(null)

  const config = useSelector(state => state.sharedConfig.config)
  const owner = useSelector(state => state.sharedConfig.owner)
  const events = useSelector(state => state.sharedConfig.events)
  const freeSlots = useSelector(state => state.sharedConfig.freeSlots)

  const shouldFetch = useSelector(state => state.sharedConfig.shouldFetch)

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

      dispatch({
        type: 'sharedConfig/set',
        payload: {
          owner: response.data.user,
          config: response.data.config,
          events: response.data.events,
          freeSlots: response.data.freeSlots
        }
      })
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
    if (shouldFetch) {
      fetchSharedSchedule()
      dispatch({ type: 'sharedConfig/setShouldFetch', payload: false })
    }
  }, [fetchSharedSchedule, shouldFetch, dispatch])

  useEffect(() => {
    if (config?.startDate && !isLoading) {
      calendarRef.current?.getApi().gotoDate(config.startDate)
    }
  }, [config?.startDate, isLoading])

  useEffect(() => {
    return () => dispatch({ type: 'events/clearCurrentSharedConfiguration' })
  })

  const onTimeSelected = useCallback(
    eventData => {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'eventDetailsInteraction',
          data: {
            type: 'create',
            data: {
              ...cleanEventData(eventData),
              isShared: true,
              scheduleOwnerId: owner?.id
            }
          }
        }
      })
    },
    [dispatch, owner]
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

  const onEventClick = useCallback(
    eventClickData => {
      if (
        !userId ||
        eventClickData.event._def.extendedProps.creatorId !== userId
      ) {
        return
      }

      const event = parseEventClickData(eventClickData)

      setSelectedEvent(event)
    },
    [userId]
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {getTitle()}
        </Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <CircularProgress />
          </Box>
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
            events={[...events, ...freeSlots]}
            headerToolbar={false}
            dayHeaders={config?.type === 'week'}
            selectConstraint="freeSlot"
            firstDay={1}
            eventClick={onEventClick}
          />
        )}
      </Grid>
      <Grid item xs={12} md={3}>
        <Event
          event={selectedEvent}
          emptyMessage="Select event you created"
          onDelete={() => setSelectedEvent(undefined)}
        />
      </Grid>
    </Grid>
  )
}
