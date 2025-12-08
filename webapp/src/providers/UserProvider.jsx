/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserProvider.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 16:11:56 by npatron           #+#    #+#             */
/*   Updated: 2025/11/17 18:00:21 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('user'))

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', user)
        } else {
            localStorage.removeItem('user')
        }
    }, [user])

    const login = useCallback((username) => {
        setUser(username)
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            login,
            logout,
        }),
        [login, logout, user],
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useUser()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: location } })
        }
    }, [isAuthenticated, location, navigate])

    if (!isAuthenticated) {
        return null
    }

    return children
}

