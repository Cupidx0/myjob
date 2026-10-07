import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../pages/AuthContext.jsx";
import Spinner from "./Spinner.jsx";

// Wait for Firebase to resolve auth, then send signed-out users to /login.
function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Spinner label="Checking your session…"/>;
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
  return children;
}

export default ProtectedRoute;
