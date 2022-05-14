import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { businessHours } from '../utils/calendar'

export default function Day() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      height="auto"
      nowIndicator
      businessHours={businessHours}
      selectable
      select={data => {
        // TODO: create events here
        console.log(data)
      }}
    />
  )
}
