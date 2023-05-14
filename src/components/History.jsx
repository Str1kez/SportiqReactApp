import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConvertToQuery from '../tools/ConvertToQuery'
import style from '../styles/History.module.css'

export default function History(props) {
  const [history, setHistory] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const query = ConvertToQuery({ page, size })
    axios
      .get(`http://api.sportiq.org:8080/api/subscription/history?${query}`, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получение истории')
        console.log(result)
        setHistory(result.data)
        const total = result.headers['x-total-count']
        if (total) {
          setTotalCount(total)
        } else {
          console.error(`ошибка получения всех историй: ${total}`)
        }
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
  }, [page, size])

  return history ? (
    <>
      <h1 className="header-title">История посещений</h1>
      <HistoryBlock history={history} />
      <nav aria-label="Page navigation example" className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 && 'disabled'}`}>
            <p
              className="page-link"
              onClick={() => setPage((page) => page - 1)}
            >
              Previous
            </p>
          </li>
          <li
            className={`page-item ${
              page === Math.ceil(totalCount / size) && 'disabled'
            }`}
          >
            <p
              className="page-link"
              onClick={() => setPage((page) => page + 1)}
            >
              Next
            </p>
          </li>
        </ul>
      </nav>
    </>
  ) : (
    <h1 className="header-title">Вы ничего не посещали</h1>
  )
}

function HistoryBlock({ history }) {
  const navigate = useNavigate()
  const handleClick = (id) => navigate(`/event/${id}`)

  return (
    <div className="container">
      <ul className="list-group">
        {history.map((event) => (
          <li
            key={event.event_id}
            className={`${style.Link} list-group-item`}
            onClick={() => handleClick(event.event_id)}
          >
            <p className={style.Title}>{event.event_title}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
