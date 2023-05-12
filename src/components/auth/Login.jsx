import React, { useState } from 'react'
import style from '../../styles/Login.module.css'

const LoginForm = ({ onLogin, errors }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    setError('')
    onLogin(username, password)
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
          <h6 className="title mb-2">Login</h6>
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="login"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" className="form-control" value="Log in" />
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginForm
