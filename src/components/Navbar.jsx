import { NavLink } from 'react-router-dom'

export default function Navbar(props) {
  return (
    <nav className="page-navbar" data-spy="affix" data-offset-top="10">
      <ul className="nav-navbar container">
        <li className="nav-item">
          <NavLink to="." className="nav-link">
            Map
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="history" className="nav-link">
            History
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="." className="nav-link">
            <img
              src="assets/imgs/placeholder.svg"
              alt="Download free bootstrap 4 landing page, free boootstrap 4 templates, Download free bootstrap 4.1 landing page, free boootstrap 4.1.1 templates, weber Landing page"
            />
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="user" className="nav-link">
            {props?.username}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="logout" className="nav-link">
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
