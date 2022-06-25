import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function Week({ onTimeSelected }) {
  const params = useParams()

  // TODO: Seletect the events for the whole week
  const events = useSelector(store => store.events[params.date])

  useEffect(() => {
    // TODO: Fetch events
  }, [params.date])

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      height="auto"
      nowIndicator
      firstDay={1}
      selectable
      select={onTimeSelected}
      initialDate={params.date}
    />
  )
}

Week.propTypes = {
  onTimeSelected: PropTypes.func
}
