import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { businessHours } from '../utils/calendar'

export default function Day() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridDay"
      height="auto"
      nowIndicator
      businessHours={businessHours}
    />
  )
}
