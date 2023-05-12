import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function MainLayout(props) {
  return (
    <>
      <Navbar {...props} />
      <div className="theme-selector">
        <a href="javascript:void(0)" className="spinner">
          <i className="ti-paint-bucket"></i>
        </a>
        <div className="body">
          <a href="javascript:void(0)" className="light"></a>
          <a href="javascript:void(0)" className="dark"></a>
        </div>
      </div>
      <Outlet />
      <Footer />
    </>
  )
}
