import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PropTypes from 'prop-types'

export default function Day({ onTimeSelected }) {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      allDaySlot={false}
      height="auto"
      nowIndicator
      selectable
      select={onTimeSelected}
    />
  )
}

Day.propTypes = {
  onTimeSelected: PropTypes.func
}
