import { useNavigate } from "react-router-dom"

export function Map(props) {
  // const navigate = useNavigate()
  // const handleClick = () => {
  //   navigate('/history?lon=43.42345&lat=43.63434')
  // }
  return (
    <>
    <div id="map" style={{height:"600px", width:"900px"}}>
    </div>
      <h1 className="header-title">What Happens Tomorrow?</h1>
      <p className="header-subtitle">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt.
      </p>
    </>
  )
}

function YandexMap(props) {
  main();
  async function main() {
    // Промис `ymaps3.ready` будет зарезолвлен, когда
    // загрузятся все компоненты API.
    await window.ymaps3.ready;
    // Создание карты.
    const map = new window.ymaps3.YMap(document.getElementById('map'), {
      location: {
        // Координаты центра карты.
        // Порядок по умолчанию: «долгота, широта».
        center: [37.64, 55.76],

        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 7
      }
    })
    map.addChild(new window.ymaps3.YMapDefaultSchemeLayer());
  }

}

