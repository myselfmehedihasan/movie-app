import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return children;
  }

  {
    /* // Redirect to login and store the current location in state */
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
