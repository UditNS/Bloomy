import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import NavBar from "./components/navBar/NavBar";
import Footer from "./components/Footer";
import axios from "axios";
import { BASE_URL } from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./utils/userSlice";
import gsap from "gsap";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const barsRef = useRef([]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      const publicRoutes = ["/login", "/signup", "/"];
      if (!publicRoutes.includes(location.pathname)) navigate("/");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  // GSAP Animation for wave loader
  useEffect(() => {
    if (isCheckingAuth && barsRef.current.length > 0) {
      barsRef.current.forEach((bar, i) => {
        gsap.fromTo(
          bar,
          { scaleY: 0.4, duration:2 },
          {
            scaleY: 1.6,
            duration: 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.1,
          }
        );
      });
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          {/* Loader Animation */}
          <div className="flex space-x-2 justify-center mb-6">
            <div className="wave-loader flex items-end h-16">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (barsRef.current[i] = el)}
                  className="bar w-2 mx-1 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 shadow-xl"
                ></div>
              ))}
            </div>
          </div>

          {/* Text */}
          <p className="mt-10 text-base text-muted-foreground animate-pulse font-medium">
            Preparing your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
