import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'

export default function List() {
  return (
    <FullCalendar
      plugins={[listPlugin]}
      initialView="listMonth"
      height="auto"
    />
  )
}
