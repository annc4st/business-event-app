import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from "../hooks/useLogout";

const LogoutBtn = () => {
    const { logout} = useLogout();
    const navigate = useNavigate();
    

    const handleLogout = async () => {
        try {
          await logout();
          navigate('/'); 
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

  return (
         
          <div>
        <button onClick={handleLogout}>Logout</button>
        </div>
    
       
  )
}

export default LogoutBtn;