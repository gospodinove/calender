import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'
import { isDateInRange } from '../utils/dates'
import CalendarNavigationBar from '../components/CalendarNavigationBar'
import { Grid } from '@mui/material'
import { cleanEventData } from '../utils/events'
import Event from '../components/Event'

export default function Week() {
  const params = useParams()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(store => store.auth.user !== undefined)

  const calendarRef = useRef(null)

  const [selectedEventId, setSelectedEventId] = useState()

  const events = useSelector(store =>
    store.events.filter(event =>
      isDateInRange(
        new Date(event.start),
        new Date(params.startDate),
        new Date(params.endDate)
      )
    )
  )

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api('events', 'GET', {
        startDate: params.startDate,
        endDate: params.endDate
      })

      if (!response.success) {
        dispatch({
          type: 'modals/show',
          payload: {
            modal: 'toast',
            data: { type: 'error', message: 'Could not load events' }
          }
        })
        return
      }

      dispatch({
        type: 'events/add',
        payload: response.events
      })
    } catch {}
  }, [params.startDate, params.endDate, dispatch])

  useEffect(() => {
    calendarRef.current.getApi().gotoDate(params.startDate)
    fetchEvents()
  }, [fetchEvents, params.startDate])

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

  const onEventClick = useCallback(eventClickData => {
    setSelectedEventId(eventClickData.event._def.publicId)
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CalendarNavigationBar
          data={{
            type: 'week',
            startDate: params.startDate,
            endDate: params.endDate
          }}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          height="auto"
          nowIndicator
          events={events}
          firstDay={1}
          selectable
          select={onTimeSelected}
          headerToolbar={false}
          eventClick={onEventClick}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Event eventId={selectedEventId} />
      </Grid>
    </Grid>
  )
}
