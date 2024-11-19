import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const {dispatch } = useAuthContext();

    const logout = () => {
        //remove user from storage
        localStorage.removeItem('user')

        //dispatch logout action, no payload
        dispatch( { type: 'LOGOUT' })
    }

    return {logout}
}