import React, { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { loginUser } from '../api'

export const useLogin = () => {
    const [error, setError ] = useState(null)
    const [isLoading, setIsLoading ] = useState(null)
    const {dispatch } = useAuthContext()
    

    const login = async (username, password ) => {
        setIsLoading(true)
        setError(null)

        try {
            const json = await loginUser({username, password});
            localStorage.setItem('user',  JSON.stringify(json))
            //updating auth context
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
        }catch (error) {
            setIsLoading(false);
            setError(error.message);  
            throw error;
        }
    };

    return { login, isLoading, error }
}