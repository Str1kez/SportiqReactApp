import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
} from '@pbe/react-yandex-maps'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateQueryString from '../tools/ConvertToQuery'

export function Main(props) {
  console.log('main')
  const [events, setEvents] = useState([])
  const [types, setTypes] = useState([])
  const [filter, setFilter] = useState({})
  console.log(events)

  useEffect(() => {
    axios
      .get('http://api.sportiq.org:8080/api/event/type', {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получение типов')
        let resultTypes = result.data?.types
        resultTypes?.unshift('')
        setTypes(resultTypes)
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
    const queryFilter = CreateQueryString({ ...filter })
    const requestURL =
      'http://api.sportiq.org:8080/api/event/map?city=Казань' +
      (queryFilter ? '&' + queryFilter : '')
    axios
      .get(requestURL, {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then((result) => {
        console.log('получил события')
        setEvents(result.data.events)
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
  }, [filter])

  return (
    <>
      {props.success && (
        <div className="alert alert-success mt-5" role="alert">
          {props.success}
        </div>
      )}
      <TestMap
        events={events}
        geocoder={props.geocoder}
        setGeocoder={props.setGeocoder}
      />
      <FiltersBlock types={types} setFilter={setFilter} />
    </>
  )
}

function FiltersBlock({ types, setFilter }) {
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const statuses = ['', 'Удалено', 'Запланировано', 'Идет', 'Завершено']

  const handleFilter = (event) => {
    event.preventDefault()
    setFilter({ type, status })
  }

  return (
    <form
      onSubmit={handleFilter}
      className="form-group mt-2"
      style={{ marginRight: '20px' }}
    >
      <label className="mr-2">Фильтры: </label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ marginRight: '20px' }}
      >
        {types.map((t, index) => (
          <option key={index + statuses.length} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ marginLeft: '20px' }}
      >
        {statuses.map((s, index) => (
          <option key={index} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input type="submit" className="form-control" value="Применить" />
    </form>
  )
}

function TestMap({ events, geocoder, setGeocoder }) {
  const navigate = useNavigate()

  const handleDoubleClick = (event) => {
    const coords = event.get('coords')
    geocoder
      ?.geocode(coords)
      .then((result) => {
        const resultObject = result.geoObjects.get(0)
        const address = resultObject.getAddressLine()
        const city = address.split(', ')[1]
        const street = resultObject.getThoroughfare()
        const house = resultObject.getPremiseNumber()
        const addressStr = street ? `${street},${house ? house : ''}` : ''
        navigate(
          `/create?latitude=${coords[0]}&longitude=${coords[1]}&city=${city}&address=${addressStr}`
        )
      })
      .catch((error) => console.error(error))
  }

  const handleMarkerClick = (id) => {
    navigate(`/event/${id}`)
  }

  const checkGeocode = (ymapsTemp) => {
    console.log('init geocode')
    setGeocoder(ymapsTemp)
  }

  return (
    <YMaps query={{ apikey: '11650dd3-fa90-488e-a33f-a25ff377e0dc' }}>
      <Map
        modules={['geocode', 'geoObject.addon.balloon', 'geoObject.addon.hint']}
        defaultState={{
          center: [55.794834, 49.125648],
          zoom: 11,
          behaviors: ['drag', 'scrollZoom', 'multiTouch'],
        }}
        style={{ height: '700px', width: '1200px' }}
        onDblClick={handleDoubleClick}
        className="mt-5"
        onLoad={checkGeocode}
      >
        <GeolocationControl options={{ float: 'right' }} />
        {events.map((event) => (
          <Placemark
            key={event.id}
            geometry={[event.latitude, event.longitude]}
            onClick={() => handleMarkerClick(event.id)}
            properties={{
              hintContent: `<h4 style="color: black">${event.title}</h4><p style="color: black">${event.type}</br>${event.status}</p>`,
            }}
          />
        ))}
      </Map>
    </YMaps>
  )
}
