import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
} from '@pbe/react-yandex-maps'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Main(props) {
  // const navigate = useNavigate()
  // const handleClick = () => {
  //   navigate('/history?lon=43.42345&lat=43.63434')
  // }
  // <YMaps>
  //   <div>
  //     <Map defaultState={{ center: [ 55.794834, 49.125648], zoom: 11 }} style={{width:"900px", height:"600px"}} />
  //   </div>
  // </YMaps>

  console.log('main')
  return (
    <>
      {props.success && (
        <div className="alert alert-success" role="alert">
          {props.success}
        </div>
      )}
      <TestMap />
    </>
  )
}

function TestMap(props) {
  const navigate = useNavigate()
  let ymaps

  const handleDoubleClick = (event) => {
    const coords = event.get('coords')
    ymaps
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

  const checkGeocode = (ymapsTemp) => {
    ymaps = ymapsTemp
    console.log('init geocode')
  }

  return (
    <YMaps query={{ apikey: '11650dd3-fa90-488e-a33f-a25ff377e0dc' }}>
      <Map
        modules={['geocode']}
        defaultState={{
          center: [55.794834, 49.125648],
          zoom: 11,
          behaviors: ['drag', 'scrollZoom', 'multiTouch'],
        }}
        style={{ height: '700px', width: '1200px' }}
        onDblClick={handleDoubleClick}
        onLoad={checkGeocode}
      >
        <GeolocationControl options={{ float: 'right' }} />
        <Placemark geometry={[55.832077, 49.14508]} />
      </Map>
    </YMaps>
  )
}

// function YandexMap(props) {
//   useEffect(() => {
//     async function main() {
//       // Промис `ymaps3.ready` будет зарезолвлен, когда
//       // загрузятся все компоненты API.
//       await window.ymaps3.ready
//       // Создание карты.
//       const map = new window.ymaps3.YMap(document.getElementById('map'), {
//         location: {
//           // Координаты центра карты.
//           // Порядок по умолчанию: «долгота, широта».
//           center: [49.125648, 55.794834],
//
//           // Уровень масштабирования. Допустимые значения:
//           // от 0 (весь мир) до 19.
//           zoom: 11,
//         },
//       })
//       const { YMapGeolocationControl } = await window.ymaps3.import(
//         '@yandex/ymaps3-controls@0.0.1'
//       )
//       const {YMapDefaultMarker} = await window.ymaps3.import('@yandex/ymaps3-markers@0.0.1');
//       map.addChild(new window.ymaps3.YMapDefaultSchemeLayer({ theme: 'dark' }))
//       map.addChild(new window.ymaps3.YMapDefaultFeaturesLayer())
//       map.addChild(
//         new window.ymaps3.YMapControls({ position: 'bottom right' }).addChild(
//           new YMapGeolocationControl()
//         )
//       )
//       map.addChild(new window.ymaps3.YMapFeatureDataSource({id: 'popups'}));
//       map.addChild(new window.ymaps3.YMapLayer({source: 'popups'}));
//       const rightPopupContent = (close) => {
//         const container = document.createElement('div');
//         container.innerHTML = `<div class="right-popup" style="width:200px; height:100px">
//             <button class="right-popup__close">✖</button>
//             <img class="right-popup__img" src="./img/flower.svg">
//             <p>Flowers studio</p>
//             <button class="right-popup__accept">Read more</button>
//         </div>`;
//         container.querySelector('.right-popup__close').onclick = close;
//         // container.querySelector('.right-popup__accept').onclick = navigate("/history")
//         return container;
//       }
//       const RIGHT_DEFAULT_MARKER_POPUP = {
//         content: rightPopupContent,
//         position: 'right',
//       }
//       map.addChild(new YMapDefaultMarker({
//                 coordinates: [49.145080, 55.832077],
//                 popup: RIGHT_DEFAULT_MARKER_POPUP
//             }));
//       }
//     main()
//   }, [])

// const leftPopup = useMemo(() => ({
//   content: (close) => <div className="left-popup">
//     <button className="left-popup__close" onClick={close}>✖</button>
//     <div className="left-popup__img"></div>
//     <div className="left-popup__info">
//         <h1 className="left-popup__title">Car repair</h1>
//         <p className="left-popup__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
//         <div className="left-popup__btn">
//             <p className="left-popup__text">Directions</p>
//         </div>
//     </div>
//   </div>,
//   position: 'top'
//   }), []);
// const YMap = window.YMap
// const YMapDefaultSchemeLayer = window.YMapDefaultSchemeLayer
//
// return (<YMap location={{center: [49.125648, 55.794834], zoom: 11}}>
//         <YMapDefaultSchemeLayer />
//       </YMap>)
// <YMapDefaultFeaturesLayer />
// <YMapFeatureDataSource id="popups" />
// <YMapLayer source="popups" />
// <YMapDefaultMarker coordinates={[49.145080, 55.832077]} popup={leftPopup} />
// console.log('here')
// useEffect(() => {
//     window.ymaps3.ready.then(() => {
//     const map = new window.ymaps3.YMap(document.getElementById('map'), {
//       location: {
//         center: [49.125648, 55.794834],
//         zoom: 11
//       }
//     });
//     map.addChild(new window.ymaps3.YMapDefaultSchemeLayer({theme: 'dark'}));
//   });
// }, [])
// return <div id="map" style={{ height: '700px', width: '1200px' }}></div>
// }
