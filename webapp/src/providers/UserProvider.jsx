/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserProvider.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 16:11:56 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 12:43:52 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("auth", JSON.stringify(user));
            if (user.token) {
                localStorage.setItem("token", user.token);
            }
        } else {
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
        }
    }, [user]);

    const login = useCallback(authPayload => {
        if (!authPayload || !authPayload.user || !authPayload.token) {
            throw new Error("Invalid auth payload");
        }
        setUser(authPayload);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user?.token),
            login,
            logout,
        }),
        [login, logout, user],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true, state: { from: location } });
        }
    }, [isAuthenticated, location, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return children;
};
