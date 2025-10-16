import React from "react";
import NavBar from "./components/navBar/NavBar";
import { ThemeProvider } from "./components/navBar/ThemeProvider";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import Login from "./components/login/Login";
import Layout from "./Layout";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import Connection from "./components/connections/Connection";
import Request from "./components/requests/Request";
import Signup from "./components/signUp/SignUp";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthRoute } from './components/ProtectedRoute';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
          {/* Public routes - redirect to home if logged in */}
          <Route 
            path="login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="signup" 
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } 
          />

          {/* Protected routes - require authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="connections" 
            element={
              <ProtectedRoute>
                <Connection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="requests" 
            element={
              <ProtectedRoute>
                <Request />
              </ProtectedRoute>
            } 
          />
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
