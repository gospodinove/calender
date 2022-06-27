import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { api } from '../utils/api'
import { isDateInRange } from '../utils/date'
export default function Week({ onTimeSelected }) {
  const params = useParams()
  const dispatch = useDispatch()

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
    fetchEvents()
  }, [fetchEvents])

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      height="auto"
      nowIndicator
      events={events}
      firstDay={1}
      selectable
      select={onTimeSelected}
      initialDate={params.startDate}
      headerToolbar={false}
    />
  )
}

Week.propTypes = {
  onTimeSelected: PropTypes.func
}
