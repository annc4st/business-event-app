import {jwtDecode} from 'jwt-decode';
import { useAuthContext } from './useAuthContext';
import { useEffect} from "react";

 export const useAuthCheck = () => {
    const { user, logout} = useAuthContext();

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (user?.token) {
              const decodedToken = jwtDecode(user.token);
              const currentTime = Date.now() / 1000;
      
              if (decodedToken.exp < currentTime) {
                alert("Your session has expired. Please log in again.");
                logout();
              }
            }
        }
        checkTokenExpiration();
    }, [user, logout]);
}

