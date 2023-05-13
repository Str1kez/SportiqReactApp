import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConvertToHuman from '../../tools/ConvertToHuman'
import ConvertToISO from '../../tools/ConvertToISO'
import style from '../../styles/Login.module.css'

export default function LookUpEvent(props) {
  const eventId = useParams().id
  const [event, setEvent] = useState({})

  useEffect(() => {
    axios
      .get(`http://api.sportiq.org:8080/api/event/${eventId}`, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получение ивента')
        console.log(result)
        setEvent(result.data)
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

  return props.user.id === event.creatorId ? (
    <EventHost
      event={event}
      setEvent={setEvent}
      accessToken={props.accessToken}
      setLoggedIn={props.setLoggedIn}
      setAccessToken={props.setAccessToken}
    />
  ) : (
    <EventGuest event={event} />
  )
}

function EventHost(props) {
  const [changeMode, setChangeMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleDelete = () => {
    axios
      .delete(`http://api.sportiq.org:8080/api/event/${props.event.id}`, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('удалено событие')
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

  const handleUpdate = (title, description, startsAt, endsAt) => {
    let tempData = { title, description, startsAt, endsAt }
    for (const key of Object.keys(tempData)) {
      if (tempData[key] === '') {
        delete tempData[key]
      }
    }
    axios
      .patch(
        `http://api.sportiq.org:8080/api/event/${props.event.id}`,
        tempData,
        {
          headers: { Authorization: `Bearer ${props.accessToken}` },
        }
      )
      .then((result) => {
        console.log('изменено событие')
        setError('')
        props.setEvent(result.data)
        setChangeMode(false)
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

  return changeMode ? (
    <>
      <EventChange onUpdate={handleUpdate} errors={error} />
      <button
        onClick={() => {
          setChangeMode(false)
          setError('')
        }}
        className="btn btn-theme-color modal-toggle"
      >
        Закрыть
      </button>
    </>
  ) : deleteMode ? (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <h1>Вы уверены?</h1>
      <button
        onClick={() => handleDelete()}
        className="btn btn-theme-color modal-toggle m-3"
      >
        Уверен!
      </button>
      <button
        onClick={() => {
          setDeleteMode(false)
          setError('')
        }}
        className="btn btn-theme-color modal-toggle m-3"
      >
        Не уверен...
      </button>
    </>
  ) : (
    <>
      <EventLookUp event={props.event} errors={error} />
      <h1>оо вы владелец</h1>
      <button
        onClick={() => setChangeMode(true)}
        className="btn btn-theme-color modal-toggle"
      >
        Изменить
      </button>
      <button
        onClick={() => setDeleteMode(true)}
        className="btn btn-theme-color modal-toggle"
      >
        Удалить
      </button>
    </>
  )
}

function EventGuest(props) {
  return (
    <>
      <EventLookUp event={props.event} />
      <h1>ой вы гость</h1>
    </>
  )
}

function EventChange({ onUpdate, errors }) {
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (title && title.length < 5) {
      setError('Название состоит минимум из 5 символов')
      return
    }
    if (!!startsAt ^ !!endsAt) {
      setError('Если обновляется дата, то необходимо указать и начало и конец')
      return
    }
    if (startsAt && endsAt && startsAt >= endsAt) {
      setError('Неверные даты')
      return
    }
    setError('')
    onUpdate(title, description, ConvertToISO(startsAt), ConvertToISO(endsAt))
  }

  return (
    <>
      <div
        className={style.Login}
        style={{ minWidth: '500px', minHeight: '100%' }}
      >
        <div className="col-md-10 col-lg-8 m-auto">
          {(error || errors) && (
            <div className="alert alert-danger" role="alert">
              {error || errors}
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Название"
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
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <label htmlFor="ends-at">Конец события: </label>
            <input
              type="datetime-local"
              className="form-control"
              id="ends-at"
              onChange={(e) => setEndsAt(e.target.value)}
            />
            <input type="submit" className="form-control" value="Создать" />
          </form>
        </div>
      </div>
    </>
  )
}

function EventLookUp({ event, errors }) {
  return (
    <div style={{ width: '800px' }}>
      {errors && (
        <div className="alert alert-danger" role="alert">
          {errors}
        </div>
      )}
      <h1 className="header-title">{event.title}</h1>
      <h2 className="title">Описание: </h2>
      <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
        {event.description ? event.description : 'Отсутствует'}
      </p>
      <h2 className="title">Адрес: </h2>
      <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
        {event.address ? event.address : 'Отсутствует'}
      </p>
      <h2 className="title">Город: </h2>
      <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
        {event.city}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 className="title">Дата начала: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {ConvertToHuman(event.startsAt)}
          </p>
        </div>
        <div>
          <h2 className="title">Дата окончания: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {ConvertToHuman(event.endsAt)}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ marginLeft: '15%' }}>
          <h2 className="title">Тип: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {event.type}
          </p>
        </div>
        <div style={{ marginRight: '8%' }}>
          <h2 className="title">Статус: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {event.status}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 className="title">Создано: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {ConvertToHuman(event.createdAt)}
          </p>
        </div>
        <div>
          <h2 className="title">Обновлено: </h2>
          <p className="header-subtitle mb-2" style={{ fontSize: '20px' }}>
            {ConvertToHuman(event.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
