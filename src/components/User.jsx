import axios from 'axios'
import { useEffect } from 'react'

export default function UserPage(props) {
  useEffect(() => {
    axios
      .post(
        'http://api.sportiq.org:8001/api/v1/auth/token/refresh',
        undefined,
        {
          withCredentials: true,
        }
      )
      .then((response) => console.log(response))
      .catch((error) => console.error(error))
  }, [])
  return <h1>Hello</h1>
}
