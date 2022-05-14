import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { businessHours } from '../utils/calendar'

export default function Week() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      height="auto"
      nowIndicator
      businessHours={businessHours}
      firstDay={1}
    />
  )
}
