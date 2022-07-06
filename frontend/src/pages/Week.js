import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'
import CalendarNavigationBar from '../components/CalendarNavigationBar'
import { Grid } from '@mui/material'
import {
  cleanEventData,
  isEventInDateRange,
  parseEventClickData
} from '../utils/events'
import Event from '../components/Event'

export default function Week() {
  const params = useParams()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(store => store.auth.user !== undefined)

  const calendarRef = useRef(null)

  const [selectedEvent, setSelectedEvent] = useState()

  const events = useSelector(store =>
    store.events.filter(event =>
      isEventInDateRange(
        event,
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
  }, [fetchEvents, params.startDate, isAuthenticated])

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
        payload: {
          modal: 'eventDetailsInteraction',
          data: { type: 'create', data: cleanEventData(eventData) }
        }
      })
    },
    [dispatch, isAuthenticated]
  )

  const onEventClick = useCallback(eventClickData => {
    const event = parseEventClickData(eventClickData)
    setSelectedEvent(event)
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
        <Event
          event={selectedEvent}
          emptyMessage="Select event"
          onDelete={() => setSelectedEvent(undefined)}
        />
      </Grid>
    </Grid>
  )
}
