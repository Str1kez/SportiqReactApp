import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout(props) {
  const navigate = useNavigate()

  useEffect(() => {
    let ok = true
    axios
      .post(
        'http://api.sportiq.org:8080/api/user/auth/token/access-revoke',
        undefined,
        {
          headers: { Authorization: `Bearer ${props.accessToken}` },
        }
      )
      .then((result) => {
        console.log(result)
        console.log('access revoked')
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log('access token уже невалидный')
        } else {
          ok = false
          console.error(error.response)
        }
      })
    if (!ok) return
    axios
      .post(
        'http://api.sportiq.org:8080/api/user/auth/token/refresh-revoke',
        undefined,
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.log(result)
        console.log('refresh revoked')
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log('refresh token уже невалидный')
        } else {
          ok = false
          console.error(error.response)
        }
      })
    if (ok) props.setLoggedOut(true)
    navigate('/', { replace: true })
  }, [])
}
