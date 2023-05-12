// import axios from 'axios'
import queryString from 'query-string';
import { useLocation } from 'react-router-dom'

export default function History({ accessToken }) {
  const params = useLocation()
  const parsed = queryString.parse(params.search);
  console.log(parsed);
  // axios
  //   .get('http://api.sportiq.org:8080/api/event/map?city=string', {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   })
  //   .then((result) => {
  //     console.log(result.data)
  //   })
  //   .catch((error) => {
  //     if (error.response?.status === 401) {
  //       console.error(error.response?.data)
  //     } else {
  //       console.error(error.response)
  //     }
  //   })
}

