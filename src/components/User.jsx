import axios from 'axios'
import { useState } from 'react'
import style from '../styles/Login.module.css'

export default function UserPage(props) {
  const [changeMode, setChangeMode] = useState(false)
  const [error, setError] = useState('')
  const handleUpdateUser = (
    username,
    password,
    phoneNumber,
    firstName,
    lastName
  ) => {
    let tempData = { username, password, phoneNumber, firstName, lastName }
    for (const key of Object.keys(tempData)) {
      if (tempData[key] === '') {
        delete tempData[key]
      }
    }
    axios
      .patch('http://api.sportiq.org:8080/api/user/info', tempData, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('обновление инфы')
        props.setUser(result.data)
        setError('')
        setChangeMode(false)
      })
      .catch((error) => {
        console.error(error.response?.data)
        if (error.response.status === 400 || error.response.status === 404) {
          setError(error.response?.data?.detail[0]?.msg)
        }
        if (error.response.status === 401) {
          axios
            .post(
              'http://api.sportiq.org:8080/api/user/auth/token/refresh',
              undefined,
              {
                withCredentials: true,
              }
            )
            .then((refreshResult) => {
              console.log('отработка при перезагрузке')
              props.setAccessToken(refreshResult.data.accessToken)
              console.log('отработка при перезагрузке 2')
            })
            .catch((errorRefresh) => {
              console.error(errorRefresh)
              props.setLoggedIn(false)
            })
        }
      })
  }

  const closeUpdateForm = () => {
    setError('')
    setChangeMode(false)
  }

  return changeMode ? (
    <UserPageChange
      errors={error}
      close={closeUpdateForm}
      onUpdate={handleUpdateUser}
    />
  ) : (
    <>
      <h1 className="header-title">Привет, {props.user.username}</h1>
      <h2 className="title">Имя: {props.user.firstName}</h2>
      <h2 className="title">Фамилия: {props.user.lastName}</h2>
      <h2 className="title">Номер телефона: {props.user.phoneNumber}</h2>
      <button
        className="btn btn-theme-color modal-toggle"
        onClick={() => setChangeMode(true)}
      >
        Изменить
      </button>
    </>
  )
}

function UserPageChange({ onUpdate, errors, close }) {
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [doublePassword, setDoublePassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (username && username.length < 6) {
      setError('Логин состоит минимум из 6 символов')
      return
    }
    if (password && password.length < 8) {
      setError('Пароль состоит минимум из 8 символов')
      return
    }
    if (doublePassword !== password) {
      setError('Пароли не совпадают')
      return
    }
    if (firstName && firstName.length < 2) {
      setError('Имя состоит минимум из 2 символов')
      return
    }
    if (lastName && lastName.length < 2) {
      setError('Имя состоит минимум из 2 символов')
      return
    }
    if (phoneNumber && phoneNumber.length < 11) {
      setError('Телефон состоит минимум из 11 символов')
      return
    }
    setError('')
    if (!username && !password && !phoneNumber && !firstName && !lastName) {
      return
    }
    onUpdate(username, password, phoneNumber, firstName, lastName)
  }

  return (
    <>
      <div
        className={style.Login}
        style={{ minWidth: '500px', minHeight: '100%' }}
      >
        <div className="col-md-10 col-lg-8 m-auto">
          <div
            className="alert alert-danger"
            role="alert"
            hidden={!error && !errors}
          >
            {error || errors}
          </div>
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Пароль еще раз"
              value={doublePassword}
              onChange={(e) => setDoublePassword(e.target.value)}
            />
            <input
              type="tel"
              className="form-control"
              placeholder="Номер телефона (начинается с +7)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              pattern="^(\+)[1-9][0-9\-\(\)\.]{9,15}$"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Ваше имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Ваша фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input type="submit" className="form-control" value="Сохранить" />
            <input
              type="button"
              className="form-control"
              value="Отмена"
              onClick={() => close()}
            />
          </form>
        </div>
      </div>
    </>
  )
}
