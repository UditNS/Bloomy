import React from 'react'
import { Outlet } from 'react-router'
import NavBar from './components/navBar/NavBar'

function Layout() {
  return (
    <>
        <NavBar />
        <Outlet /> {/*here header aur footer same but use andar component changes as route changes */}
        {/* <Footer /> */}
    </>
  )
}

export default Layout