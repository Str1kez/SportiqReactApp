export default function CreateQueryString(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === '') {
      delete obj[key]
    }
  }
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}
