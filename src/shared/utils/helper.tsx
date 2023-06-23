import moment from 'moment'

const dateFormats = [
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.sssZ',
  'DD/MM/YYYY H:mm:ss',
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'DD-MM-YYYY',
  'DD/MM/YYYY'
]

const defaultFormat = 'DD/MM/YYYY'

function formatDate(value: any, format?: string) {
  format = format ?? defaultFormat

  let formattedDate

  if (!isAlreadyFormatted(value, format)) {
    for (let i = 0; i < dateFormats.length; i++) {
      const date = moment(value, dateFormats[i])

      if (date.isValid()) {
        formattedDate = date.format(format)
        break
      }
    }
  }

  return formattedDate ?? value
}

function isAlreadyFormatted(value: any, format: string) {
  const formattedDate = moment(value, format, true)

  return formattedDate.isValid()
}

export { formatDate, isAlreadyFormatted }
