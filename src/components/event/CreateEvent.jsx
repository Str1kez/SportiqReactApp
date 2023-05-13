import axios from 'axios'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import style from '../../styles/Login.module.css'
import ConvertToISO from '../../tools/ConvertToISO'

export function CreateEvent(props) {
  const params = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const parsed = queryString.parse(params.search)
  const [types, setType] = useState([])
  console.log(parsed)

  const handleCreate = (title, description, startsAt, endsAt, type) => {
    let tempData = { title, description, startsAt, endsAt, type, ...parsed }
    for (const key of Object.keys(tempData)) {
      if (tempData[key] === '') {
        delete tempData[key]
      }
    }
    axios
      .post('http://api.sportiq.org:8080/api/event', tempData, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('создано событие')
        console.log(result.data)
        setError('')
        props.setSuccess('Событие создано!')
        navigate('/', { replace: true })
      })
      .catch((error) => {
        console.error(error.response?.data)
        if (error.response.status === 400) {
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

  useEffect(() => {
    axios
      .get('http://api.sportiq.org:8080/api/event/type', {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получение типов')
        setType(result.data?.types)
        setError('')
      })
      .catch((error) => {
        console.error(error.response?.data)
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
  }, [])
  const cancelCreate = () => {
    // TODO: payload
    navigate('/', { replace: true })
  }

  return (
    <CreateEventForm
      onCreate={handleCreate}
      close={cancelCreate}
      errors={error}
      types={types}
    />
  )
}

function CreateEventForm({ onCreate, close, errors, types }) {
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [type, setType] = useState(types[0])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (title.length < 5) {
      setError('Название состоит минимум из 5 символов')
      return
    }
    if (startsAt >= endsAt) {
      setError('Неверные даты')
      return
    }
    setError('')
    onCreate(
      title,
      description,
      ConvertToISO(startsAt),
      ConvertToISO(endsAt),
      type ? type : types[0]
    )
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
              placeholder="Название"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              type="text"
              className="form-control"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="starts-at">Начало события: </label>
            <input
              type="datetime-local"
              className="form-control"
              id="starts-at"
              required
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <label htmlFor="ends-at">Конец события: </label>
            <input
              type="datetime-local"
              className="form-control"
              id="ends-at"
              required
              onChange={(e) => setEndsAt(e.target.value)}
            />
            <select
              className="mb-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {types.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input type="submit" className="form-control" value="Создать" />
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
