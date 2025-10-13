import React from "react";
import NavBar from "./components/navBar/NavBar";
import { ThemeProvider } from "./components/navBar/ThemeProvider";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import Login from "./components/login/Login";
import Layout from "./Layout";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import Connection from "./components/connections/Connection";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path = '/' element = {<Layout />}>
          <Route path = '/' element = {<Feed />}></Route>
          <Route path = '/login' element = {<Login />}></Route>
          <Route path = '/profile' element = {<Profile />}></Route>
          <Route path = '/connection' element={<Connection />}></Route>
          <Route path = '/requests' element={<Connection />}></Route>

        {/* <Route loader={gitInfoLoader} path = '/github' element = {<Github />}></Route> */}
      </Route>
    )
  )
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router = {router}/>
      </ThemeProvider>
    </>
  );
}

export default App;


/*
Flow of the app
Body
  NavBar
  Route = '/' -> Feed
  Route = '/login' -> Login
  Route = '/connection' -> Connections
  Route = '/profile' -> profile page

*/
