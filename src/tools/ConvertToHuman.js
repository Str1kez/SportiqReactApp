export default function ConvertToHuman(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  }
  const d = new Date(date)
  return d.toLocaleString('ru', options)
}
