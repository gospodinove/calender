import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { businessHours } from '../utils/calendar'
import PropTypes from 'prop-types'

export default function Week({ onTimeSelected }) {
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
    />
  )
}

Week.propTypes = {
  onTimeSelected: PropTypes.func
}
