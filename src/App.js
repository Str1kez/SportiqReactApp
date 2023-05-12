import axios from 'axios'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './components/auth/Login'
import Footer from './components/Footer'
import MainLayout from './components/MainLayout'
import { Map } from './components/Map'
import UserPage from './components/User'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')

  // const handleError = ()
  const handleLogin = (username, password) => {
    axios
      // .post('http://localhost:8080/api/user/auth/login', { username, password }, {withCredentials: true})
      .post(
        'http://api.sportiq.org:8001/api/v1/auth/login',
        { username, password },
        { withCredentials: true }
      )
      .then((result) => {
        console.log('логин')
        setAccessToken(result.data.accessToken)
        console.log('логин 2')
        setLoggedIn(true)
      })
      .catch((error) => {
        console.error(error.response?.data)
        if (error.response.status === 401 || error.response.status === 404) {
          setError(error.response?.data?.detail[0]?.msg)
        }
      })
  }

  useEffect(() => {
    if (loggedIn) {
      return
    }
    axios
      // .post('http://localhost:8080/api/user/auth/token/refresh', {
      .post(
        'http://api.sportiq.org:8001/api/v1/auth/token/refresh',
        undefined,
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.log('отработка при перезагрузке')
        setLoggedIn(true)
        console.log('отработка при перезагрузке 2')
        setAccessToken(result.data.accessToken)
      })
      .catch((errorRefresh) => console.error(errorRefresh))
  }, [loggedIn])

  useEffect(() => {
    if (!loggedIn) {
      return
    }
    axios
      .get('http://localhost:8080/api/user/info', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((result) => {
        console.log(result.data)
        console.log('получил пользователя')
        setUsername(result.data.username)
      })
      .catch((error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.detail[0]?.type === 'token.expired'
        ) {
          axios
            // .post('http://localhost:8080/api/user/auth/token/refresh', {
            .post(
              'http://sportiq.org:8001/api/v1/auth/token/refresh',
              undefined,
              {
                withCredentials: true,
              }
            )
            .then((result) => {
              console.log(
                'должно отрабатывать при недоступности инфы пользователя'
              )
              setAccessToken(result.data.accessToken)
            })
            .catch((errorRefresh) => console.error(errorRefresh))
        }
        console.log('токен невалидный')
        setLoggedIn(false)
        console.error(error.response?.data)
      })
  }, [loggedIn])

  return loggedIn ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout username={username} />}>
          <Route index element={<Map />} />
          <Route path="user" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  ) : (
    <>
      <LoginForm onLogin={handleLogin} errors={error} />
      <Footer />
    </>
  )
}

export default App
