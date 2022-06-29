module.exports.replaceId = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}

module.exports.sendErrorResponse = function (
  res,
  status,
  messageType,
  messages
) {
  res.status(status).json({
    success: false,
    code: status,
    messageType: messageType,
    messages:
      messageType === 'field-error'
        ? parseValidationErrorMessages(messages)
        : messages
  })
}

const parseValidationErrorMessages = errors => {
  const result = {}

  for (const err of errors) {
    result[err.field] = err.message
  }

  result.isValidationError = true

  return result
}

module.exports.isMultidayEvent = function (event) {
  return (
    getDatesDifferenceInDays(new Date(event.start), new Date(event.end)) > 1
  )
}

module.exports.splitMultidayEvent = function (event) {
  if (
    getDatesDifferenceInDays(new Date(event.start), new Date(event.end)) === 1
  ) {
    return [event]
  }

  const result = []

  const eventEnd = new Date(event.end)

  let currentStart = new Date(event.start)

  while (currentStart < eventEnd) {
    const currentEnd = new Date(currentStart)
    currentEnd.setHours(23, 59, 59, 999)

    const newEvent = {
      ...event,
      start: currentStart,
      end: currentEnd > eventEnd ? eventEnd : currentEnd
    }

    result.push(newEvent)

    currentStart = new Date(currentStart)
    currentStart = new Date(currentStart.setDate(currentStart.getDate() + 1))
    currentStart.setHours(0, 0, 0, 0)
  }

  return result
}

const getDatesDifferenceInDays = (dayOne, dayTwo) => {
  const diffTime = Math.abs(dayTwo - dayOne)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
