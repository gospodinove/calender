export const getWeekEndForDate = date =>
  new Date(date.setDate(getWeekStartForDate(date).getDate() + 6))

export const getWeekStartForDate = date =>
  new Date(date.setDate(date.getDate() - date.getDay() + 1))

export const getWeekBoundsForDate = date => [
  getWeekStartForDate(date),
  getWeekEndForDate(date)
]

export const isDateInRange = (date, startRange, endRange) => {
  startRange.setHours(0, 0, 0, 0)
  endRange.setHours(23, 59, 59, 999)

  return startRange <= date && date <= endRange
}

export const addDaysToDate = (days, date) =>
  new Date(date.setDate(date.getDate() + days))
