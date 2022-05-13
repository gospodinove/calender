import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/timegrid'

export default function Day() {
  return <FullCalendar plugins={[dayGridPlugin]} initialView="timeGridDay" />
}
