export const formatDate = date => {
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  let year = date.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const formatReadableDate = (date, includeWeekday = false) =>
  date.toLocaleDateString('en-BG', {
    weekday: includeWeekday ? 'long' : undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
