import React from "react";
import { ThemeProvider } from "./components/navBar/ThemeProvider";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import LoginPage from "./pages/Login";
import Layout from "./Layout";
import Feeds from "./pages/Feeds";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Signup from "./pages/Signup";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthRoute } from './components/ProtectedRoute';
import Chats from "./pages/Chats";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="" element={<Layout />}>
          {/* Public routes - redirect to home if logged in */}
          <Route 
            path="login" 
            element={
              <AuthRoute>
                <LoginPage />
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
          <Route 
            path="/" 
            element={
              <AuthRoute>
                <Home />
              </AuthRoute>
            } 
          />

          {/* Protected routes - require authentication */}
          <Route 
            path="feed" 
            element={
              <ProtectedRoute>
                <Feeds />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="connections" 
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chat/:targetUserId" 
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="requests" 
            element={
              <ProtectedRoute>
                <Requests />
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
  Route = '/feed' -> Feed
  Route = '/login' -> Login
  Route = '/connection' -> Connections
  Route = '/profile' -> profile page

*/
