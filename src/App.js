import axios from 'axios'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Index from './components/auth/Index'
import Logout from './components/auth/Logout'
import Footer from './components/Footer'
import MainLayout from './components/MainLayout'
import History from './components/History'
import { Main } from './components/Map'
import NotFound from './components/NotFound'
import UserPage from './components/User'
import { CreateEvent } from './components/event/CreateEvent'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState({})
  const [geocoder, setGeocoder] = useState()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess('')
    }, 5000)
    return () => clearTimeout(timer)
  }, [success])

  const handleLogin = (username, password) => {
    axios
      .post(
        'http://api.sportiq.org:8080/api/user/auth/login',
        { username, password },
        { withCredentials: true }
      )
      .then((result) => {
        console.log('логин')
        setAccessToken(result.data.accessToken)
        console.log('логин 2')
        setError('')
        setLoggedOut(false)
        setLoggedIn(true)
      })
      .catch((error) => {
        console.error(error.response?.data)
        if (error.response.status === 401 || error.response.status === 404) {
          setError(error.response?.data?.detail[0]?.msg)
        }
      })
  }

  const handleSignUp = (
    username,
    password,
    phoneNumber,
    firstName,
    lastName
  ) => {
    axios
      .post('http://api.sportiq.org:8080/api/user/auth/signup', {
        username,
        password,
        phoneNumber,
        firstName,
        lastName,
      })
      .then((result) => {
        console.log('регистрация')
        setAccessToken(result.data.accessToken)
        console.log('регистрация 2')
        setError('')
        setLoggedOut(false)
        setLoggedIn(true)
      })
      .catch((error) => {
        console.error(error.response?.data)
        if (error.response.status === 400 || error.response.status === 404) {
          setError(error.response?.data?.detail[0]?.msg)
        }
      })
  }

  useEffect(() => {
    if (loggedOut) return
    if (!loggedIn) {
      axios
        .post(
          'http://api.sportiq.org:8080/api/user/auth/token/refresh',
          undefined,
          {
            withCredentials: true,
          }
        )
        .then((result) => {
          console.log('отработка при перезагрузке')
          setAccessToken(result.data.accessToken)
          console.log('отработка при перезагрузке 2')
          setLoggedIn(true)
        })
        .catch((errorRefresh) => console.error(errorRefresh))
    } else {
      axios
        .get('http://api.sportiq.org:8080/api/user/info', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((result) => {
          console.log(result.data)
          console.log('получил пользователя')
          setUser(result.data)
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log(error.response?.data)
            setLoggedIn(false)
          } else {
            console.error(error.response)
          }
        })
    }
  }, [loggedIn, loggedOut])

  return loggedIn && !loggedOut ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout username={user.username} />}>
          <Route
            index
            element={
              <Main
                success={success}
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                setLoggedIn={setLoggedIn}
                geocoder={geocoder}
                setGeocoder={setGeocoder}
              />
            }
          />
          <Route
            path="user"
            element={
              <UserPage
                user={user}
                setUser={setUser}
                errors={error}
                setLoggedIn={setLoggedIn}
                accessToken={accessToken}
                setAccessToken={setAccessToken}
              />
            }
          />
          <Route
            path="history"
            element={<History accessToken={accessToken} />}
          />
          <Route
            path="create"
            element={
              <CreateEvent
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                setLoggedIn={setLoggedIn}
                setSuccess={setSuccess}
              />
            }
          />
          <Route
            path="logout"
            element={
              <Logout accessToken={accessToken} setLoggedOut={setLoggedOut} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  ) : (
    <>
      <Index onLogin={handleLogin} onSignUp={handleSignUp} errors={error} />
      <Footer />
    </>
  )
}

export default App
