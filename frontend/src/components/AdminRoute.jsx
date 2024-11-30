import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";



const AdminRoute = ({children}) => {
    const { user, dispatch } = useAuthContext(); // Access user from context
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [isAdmin, setIsAdmin] = useState(false);
    
  useEffect(() => {
    // If user is loaded, check if they are admin
    if (user) {
      if (user.username === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    }
  }, [user]);

  
  if (isLoading) {
    return <div>Loading...</div>; 
  }


  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children; // Return children if user is admin
};

export default AdminRoute;