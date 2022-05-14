import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { businessHours } from '../utils/calendar'

export default function Week() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      height="auto"
      nowIndicator
      businessHours={businessHours}
      firstDay={1}
      selectable
      select={data => {
        // TODO: create events here
        console.log(data)
      }}
    />
  )
}
