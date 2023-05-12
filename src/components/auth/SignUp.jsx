import React, { useState } from 'react'
import style from '../../styles/Login.module.css'

export default function SignUpForm({ onSignUp, errors, setNeedLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [doublePassword, setDoublePassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (username.length < 6) {
      setError('Логин состоит минимум из 6 символов')
      return
    }
    if (password.length < 8) {
      setError('Пароль состоит минимум из 8 символов')
      return
    }
    if (doublePassword !== password) {
      setError('Пароли не совпадают')
      return
    }
    if (firstName.length < 2) {
      setError('Имя состоит минимум из 2 символов')
      return
    }
    if (lastName.length < 2) {
      setError('Имя состоит минимум из 2 символов')
      return
    }
    if (phoneNumber.length < 11) {
      setError('Телефон состоит минимум из 11 символов')
      return
    }
    setError('')
    onSignUp(username, password, phoneNumber, firstName, lastName)
  }

  return (
    <>
      <div className="theme-selector">
        <a href="javascript:void(0)" className="spinner">
          <i className="ti-paint-bucket"></i>
        </a>
        <div className="body">
          <a href="javascript:void(0)" className="light"></a>
          <a href="javascript:void(0)" className="dark"></a>
        </div>
      </div>
      <div className={style.Login}>
        <div className="col-md-10 col-lg-8 m-auto">
          <div
            className="alert alert-danger"
            role="alert"
            hidden={!error && !errors}
          >
            {error || errors}
          </div>
          <h6 className="title mb-2">Регистрация</h6>
          <p
            className={`${style.Link} mb-2`}
            onClick={() => setNeedLogin(true)}
          >
            Вход
          </p>
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Логин"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Пароль"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Пароль еще раз"
              required
              value={doublePassword}
              onChange={(e) => setDoublePassword(e.target.value)}
            />
            <input
              type="tel"
              className="form-control"
              placeholder="Номер телефона (начинается с +7)"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              pattern="^(\+)[1-9][0-9\-\(\)\.]{9,15}$"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Ваше имя"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Ваша фамилия"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input type="submit" className="form-control" value="Регистрация" />
          </form>
        </div>
      </div>
    </>
  )
}
