import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import NavBar from './components/navBar/NavBar'
import Footer from './components/Footer'
import axios from 'axios'
import { BASE_URL } from './utils/constant'
import { useDispatch } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useNavigate } from 'react-router'

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const fetchUser = async () => {
    // whenever the page reloads the user from the store vanished which causes error in loading the profile pic
    try {
      const user = await axios.get(BASE_URL + '/profile/view',{
        withCredentials: true
      })
      dispatch(addUser(user.data))
    }
    catch(error){
      navigate('/login')
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])
  return (
    <>
        <NavBar />
        <Outlet /> {/*here header aur footer same but use andar component changes as route changes */}
        <Footer />
    </>
  )
}

export default Layout