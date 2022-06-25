import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function Day({ onTimeSelected }) {
  const params = useParams()

  const events = useSelector(store => store.events[params.date])

  useEffect(() => {
    // TODO: Fetch events
  }, [params.date])

  return (
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
    />
  )
}

Day.propTypes = {
  onTimeSelected: PropTypes.func
}
