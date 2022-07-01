export const cleanEventData = data => {
  const copy = data

  delete copy.endStr
  delete copy.startStr
  delete copy.jsEvent
  delete copy.view

  copy.start = data.start.toString()
  copy.end = data.end.toString()

  return copy
}

export const isEventInDateRange = (event, startRange, endRange) => {
  startRange.setHours(0, 0, 0, 0)
  endRange.setHours(23, 59, 59, 999)

  return (
    (startRange <= new Date(event.start) &&
      new Date(event.start) <= endRange) ||
    (startRange <= new Date(event.end) && new Date(event.end) <= endRange)
  )
}
