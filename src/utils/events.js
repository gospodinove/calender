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
