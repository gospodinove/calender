import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { api } from '../utils/api'
import { isDateInRange } from '../utils/date'

export default function Day({ onTimeSelected }) {
  const params = useParams()
  const dispatch = useDispatch()

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
    const response = await api('events', 'GET', {
      startDate: params.date,
      endDate: params.date
    })

    if (!response.success) {
      // TODO: Error handling
      return
    }

    dispatch({
      type: 'events/add',
      payload: response.events
    })
  }, [params.date, dispatch])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return (
    // TODO: custom toolbar
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      allDaySlot={false}
      height="auto"
      nowIndicator
      selectable
      select={onTimeSelected}
      events={events}
      initialDate={params.date}
      headerToolbar={false}
    />
  )
}

Day.propTypes = {
  onTimeSelected: PropTypes.func
}
