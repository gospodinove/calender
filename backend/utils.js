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

module.exports.getFreeSlotsInRange = function (
  startDate,
  endDate,
  eventRanges
) {
  const result = []

  let start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  let end = new Date()

  let closestStartingEvent = getEventWithClosestStart(start, eventRanges)

  while (closestStartingEvent !== undefined) {
    end = closestStartingEvent.start

    result.push({
      groupId: 'freeSlot',
      start,
      end,
      display: 'background',
      color: 'transparent'
    })

    let furthestEndingOverlappingEvent = getFurthestEndingOverlappingEvent(
      closestStartingEvent,
      eventRanges
    )

    if (!furthestEndingOverlappingEvent) {
      start = new Date(closestStartingEvent.end)
    } else {
      start = new Date(
        closestStartingEvent.end > furthestEndingOverlappingEvent.end
          ? closestStartingEvent.end
          : furthestEndingOverlappingEvent.end
      )
    }

    closestStartingEvent = getEventWithClosestStart(start, eventRanges)
  }

  const rangeEnd = new Date(endDate)
  rangeEnd.setHours(23, 59, 59, 999)

  result.push({
    groupId: 'freeSlot',
    start,
    end: rangeEnd,
    display: 'background',
    color: 'transparent'
  })

  return result.filter(e => e.start.getTime() !== e.end.getTime())
}

const getEventWithClosestStart = (start, events) => {
  const eventsAfterStart = events.filter(e => e.start >= start)

  if (eventsAfterStart.length === 0) {
    return undefined
  }

  return eventsAfterStart.sort(
    (e1, e2) => e1.start.getTime() - e2.start.getTime()
  )[0]
}

const getFurthestEndingOverlappingEvent = (event, events) => {
  const overlappingEvents = events.filter(e => e.start <= event.end)

  if (overlappingEvents.length === 0) {
    return undefined
  }

  return overlappingEvents.sort(
    (e1, e2) => e2.end.getTime() - e1.end.getTime()
  )[0]
}
