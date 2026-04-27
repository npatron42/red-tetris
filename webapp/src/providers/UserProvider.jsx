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
import { getUser } from "../composables/useApi";

const UserContext = createContext(null);

const clearStoredAuth = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
};

const readStoredAuth = () => {
    const stored = localStorage.getItem("auth");
    if (!stored) {
        return null;
    }
    try {
        return JSON.parse(stored);
    } catch (error) {
        clearStoredAuth();
        return null;
    }
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(readStoredAuth);
    const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(readStoredAuth()?.token));

    useEffect(() => {
        if (user) {
            localStorage.setItem("auth", JSON.stringify(user));
            if (user.token) {
                localStorage.setItem("token", user.token);
            }
        } else {
            clearStoredAuth();
        }
    }, [user]);

    useEffect(() => {
        let isCancelled = false;

        const validateStoredUser = async () => {
            if (!user?.token) {
                setIsAuthLoading(false);
                return;
            }

            setIsAuthLoading(true);
            try {
                const response = await getUser();
                if (isCancelled) {
                    return;
                }
                if (!response?.user?.id) {
                    setUser(null);
                    return;
                }
                setUser(currentUser =>
                    currentUser?.token
                        ? {
                              ...currentUser,
                              user: response.user,
                          }
                        : currentUser,
                );
            } catch (error) {
                const status = error.response?.status;
                const requestUrl = error.config?.url || "";
                const shouldClearAuth = status === 401 || (status === 404 && requestUrl.includes("/user/me"));

                if (!isCancelled && shouldClearAuth) {
                    setUser(null);
                }
            } finally {
                if (!isCancelled) {
                    setIsAuthLoading(false);
                }
            }
        };

        validateStoredUser();

        return () => {
            isCancelled = true;
        };
    }, [user?.token]);

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
            isAuthenticated: Boolean(user?.token) && !isAuthLoading,
            isAuthLoading,
            login,
            logout,
        }),
        [isAuthLoading, login, logout, user],
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
    const { isAuthenticated, isAuthLoading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/login", { replace: true, state: { from: location } });
        }
    }, [isAuthLoading, isAuthenticated, location, navigate]);

    if (isAuthLoading || !isAuthenticated) {
        return null;
    }

    return children;
};
