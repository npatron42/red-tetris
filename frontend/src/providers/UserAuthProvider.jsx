/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserAuthProvider.jsx                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 16:03:13 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/12/23 17:14:41 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../api/api';

const UserAuthContext = createContext(null);

export const useAuth = () => {
    return useContext(UserAuthContext);
};

export const UserAuthProvider = ({ children }) => {
    const [myUser, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const myJwt = localStorage.getItem("jwt");
    useEffect(() => {
        if (["/",].includes(location.pathname) && myJwt)
            return ;
        if (["/login", "/register",].includes(location.pathname) && myJwt)
            navigate("/home")
        else if (["/login", "/register"].includes(location.pathname)) {
            setIsLoading(false);
            return;
        }

        if (!myJwt) {
            console.log("OUI")
            navigate('/');
            return;
        }

        const defineUser = async () => {
            try {
                const myUserTmp = await getUser();
                console.log("myUser --> ", myUserTmp)
                setUser(myUserTmp);
            } catch (error) {
                localStorage.removeItem("jwt");
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        if (myJwt) {
            defineUser();
        }
    }, [navigate, location.pathname, myJwt]);

    if (isLoading) {
        return <div>
                    <div className="loader"> 
                    </div>
                </div>
    }

    return (
        <UserAuthContext.Provider value={{ myUser, setUser }}>
            {children}
        </UserAuthContext.Provider>
    );
};