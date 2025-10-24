// ProtectedRoute.jsx - For routes that require authentication
import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

// Protects routes that need authentication (Feed, Profile, etc.)
export default function ProtectedRoute({ children }) {
  const user = useSelector((store) => store.user);
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // If user is logged in, render the protected component
  return children;
}

// Protects auth routes (Login, Signup) - redirects if already logged in
export function AuthRoute({ children }) {
  const user = useSelector((store) => store.user);
  
  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  
  // If user is not logged in, show login/signup page
  return children;
}