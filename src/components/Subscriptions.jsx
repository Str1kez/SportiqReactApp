import axios from 'axios'
import { useEffect, useState } from 'react'
import ConvertToHuman from '../tools/ConvertToHuman'
import style from '../styles/History.module.css'
import { useNavigate } from 'react-router-dom'

export default function Subscriptions(props) {
  const [subs, setSubs] = useState([])
  const [events, setEvents] = useState({})

  useEffect(() => {
    axios
      .get('http://api.sportiq.org:8080/api/subscription/subscriptions', {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получение списка подписок')
        console.log(result)
        setSubs(result.data)
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

  useEffect(() => {
    axios
      .get('http://api.sportiq.org:8080/api/event/map?city=Казань', {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получил события')
        const hashMap = {}
        result.data.events.forEach((element) => {
          hashMap[element.id] = element
        })
        setEvents((events) => ({ ...events, ...hashMap }))
      })
      .catch((error) => {
        if (error.response?.status === 401) {
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

  useEffect(() => {
    axios
      .get(
        'http://api.sportiq.org:8080/api/event/map?city=Казань&status=Удалено',
        {
          headers: { Authorization: `Bearer ${props.accessToken}` },
        }
      )
      .then((result) => {
        console.log('получил удаленные события')
        const hashMap = {}
        result.data.events.forEach((element) => {
          hashMap[element.id] = element
        })
        setEvents((events) => ({ ...events, ...hashMap }))
      })
      .catch((error) => {
        if (error.response?.status === 401) {
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

  return <SubscriptionsBlock events={events} subs={subs} />
}

function SubscriptionsBlock({ events, subs }) {
  const navigate = useNavigate()
  const data = []
  subs.forEach((element) => {
    if (events[element.event_id]) {
      data.push({ ...events[element.event_id], status: element.status })
    }
  })
  const subscriptions = data.sort((a, b) => {
    if (a.startsAt > b.startsAt) return 1
    if (a.startsAt < b.startsAt) return -1
    if (a.startsAt === b.startsAt) return 0
  })

  return (
    <div style={{ minWidth: '900px' }}>
      <h6 className="header-title">Подписки</h6>
      <table className="table-dark" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Дата</th>
            <th scope="col">Тип</th>
            <th scope="col">Статус</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr
              key={sub.id}
              className={style.Link}
              onClick={() => navigate(`/event/${sub.id}`)}
            >
              <td style={{ width: '20%' }}>{sub.title}</td>
              <td style={{ width: '20%' }}>{ConvertToHuman(sub.startsAt)}</td>
              <td style={{ width: '20%' }}>{sub.type}</td>
              <td style={{ width: '20%' }}>{sub.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
