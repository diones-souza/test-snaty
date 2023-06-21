import moment from 'moment'

function formatDateTime(value: any) {
  const formattedDateTime = moment(value, 'YYYY-MM-DDTHH:mm:ss').format(
    'DD/MM/YYYY H:mm:ss'
  )

  if (moment(formattedDateTime, 'DD/MM/YYYY H:mm:ss').isValid()) {
    return formattedDateTime
  } else {
    return value
  }
}

function formatDate(value: any) {
  const formattedDate = moment(value, 'YYYY-MM-DDTHH:mm:ss').format(
    'DD/MM/YYYY'
  )

  if (moment(formattedDate, 'DD/MM/YYYY').isValid()) {
    return formattedDate
  } else {
    return value
  }
}

export { formatDateTime, formatDate }
