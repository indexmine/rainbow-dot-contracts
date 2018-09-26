import React from 'react'
import { history } from '../store'

const locationToActive = (id) => {
  if (history.location.pathname) {
    return history.location.pathname === id ? 'active': '';
  } else if(history.location.pathname === '') {
    return id === '/home' ? 'active' : '';
  }
}
const NavBar = () => {
  console.log(history.location.pathname);
  return (
      <header id="header">
        <nav>
          <ul>
            <li><a href="/" className={locationToActive('/')}>Home</a></li>
            <li><a href="/season-manager" className={locationToActive('/season-manager')}>Create</a></li>
            <li><a href="/season" className={locationToActive('/season')}>Participate</a></li>
            <li><a href="/market" className={locationToActive('/market')}>Market</a></li>
          </ul>
        </nav>
      </header>
  )};
export default NavBar
