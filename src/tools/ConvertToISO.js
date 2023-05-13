export default function ConvertToISO(dateTime) {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset()
  const hours = Math.abs(Math.floor(timezoneOffset / 60))
  const minutes = Math.abs(timezoneOffset % 60)
  const timezone =
    (timezoneOffset <= 0 ? '+' : '-') +
    (hours < 10 ? '0' : '') +
    hours +
    ':' +
    (minutes < 10 ? '0' : '') +
    minutes
  return dateTime ? dateTime + timezone : ''
}
