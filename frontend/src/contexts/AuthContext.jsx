import { createContext, useReducer, useEffect } from "react";

//create our context with react function  createContext()
export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [ state, dispatch] = useReducer( authReducer, {
        user: null
    })
    console.log('AuthCONTEXT state: ', state)

    //check in localstorage whether user is logged in especially if we have value user in localstorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch( {type: 'LOGIN', payload: user})
        }
    }, [])
    

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}