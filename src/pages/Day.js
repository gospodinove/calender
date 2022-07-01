import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'
import { isDateInRange } from '../utils/dates'
import CalendarNavigationBar from '../components/CalendarNavigationBar'
import { Grid } from '@mui/material'
import { cleanEventData } from '../utils/events'
import Event from '../components/Event'

export default function Day() {
  const params = useParams()
  const dispatch = useDispatch()

  const calendarRef = useRef(null)

  const isAuthenticated = useSelector(store => store.auth.user !== undefined)

  const [selectedEventId, setSelectedEventId] = useState()

  const events = useSelector(store =>
    store.events.filter(event =>
      isDateInRange(
        new Date(event.start),
        new Date(params.date),
        new Date(params.date)
      )
    )
  )

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api('events', 'GET', {
        startDate: params.date,
        endDate: params.date
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
  }, [params.date, dispatch])

  useEffect(() => {
    calendarRef.current.getApi().gotoDate(params.date)
    fetchEvents()
  }, [fetchEvents, params.date])

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
        <CalendarNavigationBar data={{ type: 'day', date: params.date }} />
      </Grid>
      <Grid item xs={12} md={9}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          allDaySlot={false}
          height="auto"
          nowIndicator
          selectable
          select={onTimeSelected}
          events={events}
          headerToolbar={false}
          dayHeaders={false}
          eventClick={onEventClick}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Event eventId={selectedEventId} />
      </Grid>
    </Grid>
  )
}
