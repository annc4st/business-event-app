import React, { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { registerUser } from '../api'

export const useSignup = () => {
    const [error, setError ] = useState(null)
    const [isLoading, setIsLoading ] = useState(null)
    const {dispatch } = useAuthContext()

    const signup = async (username, password, email) => {
        setIsLoading(true);
        setError(null);

        try {
            const json = await registerUser({ username, password, email});
            
            //store user data (including token) in local storage
            localStorage.setItem('user', JSON.stringify(json));

            // Update auth context with registered user data
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        } catch (error) {
            // Handle any error from the registration process
            setIsLoading(false);
            setError(error.message);  // Set the error message based on backend response
        }
    };

    return {signup, isLoading, error}
}


    