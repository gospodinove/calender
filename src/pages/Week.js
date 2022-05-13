import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Week() {
  return <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" />
}
