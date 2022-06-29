import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { api } from '../utils/api'
import { isDateInRange } from '../utils/dates'
import CalendarNavigationBar from '../components/CalendarNavigationBar'
import { Grid } from '@mui/material'
export default function Week({ onTimeSelected }) {
  const params = useParams()
  const dispatch = useDispatch()

  const calendarRef = useRef(null)

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
        // TODO: Error handling
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
      <Grid item xs={9}>
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
        />
      </Grid>
      <Grid item xs={3}>
        Selected event
      </Grid>
    </Grid>
  )
}

Week.propTypes = {
  onTimeSelected: PropTypes.func
}
