import React, { useEffect, useState, useRef } from 'react'
import { Outlet } from 'react-router'
import NavBar from './components/navBar/NavBar'
import Footer from './components/Footer'
import axios from 'axios'
import { BASE_URL } from './utils/constant'
import { useDispatch } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import gsap from 'gsap'

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((store) => (store.user))
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pulseRefs = useRef([])
  const fetchUser = async () => {
    // whenever the page reloads the user from the store vanished which causes error in loading the profile pic
    try {
      const user = await axios.get(BASE_URL + '/profile/view',{
        withCredentials: true
      })
      dispatch(addUser(user.data))
    }
    catch(error){
      // Only redirect to login if user is on a protected route
      const publicRoutes = ['/login', '/signup'];
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    }
    finally {
      setIsCheckingAuth(false)
    }
  }

  useEffect(() => {
    if(!user){
      fetchUser();
    }
  }, [])

  useEffect(() => {
    if (isCheckingAuth && pulseRefs.current.length === 3) {
      // Create a persistent Timeline
      const tl = gsap.timeline({ 
        repeat: -1, 
        defaults: { duration: 0.4, ease: "power2.inOut" } 
      });

      // Stagger the animation across the three dots
      tl.to(pulseRefs.current, {
          scale: 1.5, // Scale up
          backgroundColor: '#ec4899', // Highlight color (pink-500 equivalent)
          opacity: 1,
          stagger: {
            each: 0.15, // Delay between each dot starting
            repeat: -1, // Make the stagger repeat
            yoyo: true // Smoothly transition back
          }
      }, 0); // Start the animation immediately

      // Add a slight movement effect for depth (optional but nice)
      tl.to(pulseRefs.current, {
          y: -5,
          stagger: 0.15,
          duration: 0.4,
          ease: "power2.inOut"
      }, 0); // Start at the same time

      // Set initial styles for all dots before animation begins
      gsap.set(pulseRefs.current, { 
          scale: 1, 
          opacity: 0.5,
          backgroundColor: '#e5e7eb' // Initial muted color (gray-200 equivalent)
      });
    }
  }, [isCheckingAuth]);


  // -----------------------------------------------------------------
  // 2. LOADER RETURN BLOCK (Replaces the old one)
  // -----------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          
          <div className="flex space-x-3 justify-center mb-6">
            {/* Dot 1 */}
            <div 
              ref={el => pulseRefs.current[0] = el}
              className="w-4 h-4 rounded-full shadow-md"
            />
            {/* Dot 2 */}
            <div 
              ref={el => pulseRefs.current[1] = el}
              className="w-4 h-4 rounded-full shadow-md"
            />
            {/* Dot 3 */}
            <div 
              ref={el => pulseRefs.current[2] = el}
              className="w-4 h-4 rounded-full shadow-md"
            />
          </div>
          
          <p className="mt-4 text-base text-muted-foreground font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
        <NavBar />
        <Outlet /> {/*here header aur footer same but use andar component changes as route changes */}
        <Footer />
    </>
  )
}

export default Layout