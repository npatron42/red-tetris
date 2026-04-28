/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 16:28:20 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Login.css";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createUser } from "../../composables/useApi.js";
import { useUser } from "../../providers/UserProvider.jsx";
import { parseUserName, sanitizeUserNameInput, USER_NAME_MAX_LENGTH } from "../../utils/userName.js";

import { ToastContainer, toast, Bounce } from "react-toastify";

const Login = () => {
    const [name, setUsername] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useUser();

    const redirectPath = useMemo(() => location.state?.from?.pathname || "/", [location]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectPath]);

    const handleSubmit = async event => {
        event.preventDefault();
        const parsedName = parseUserName(name);
        if (!parsedName) {
            return;
        }
        try {
            const response = await createUser(parsedName);

            if (response?.token && response?.user) {
                login(response);
                toast("Welcome!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                navigate(redirectPath, { replace: true });
            } else {
                toast.error("Login failed");
            }
        } catch (error) {
            toast.error("Login failed");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={event => setUsername(sanitizeUserNameInput(event.target.value))}
                    maxLength={USER_NAME_MAX_LENGTH}
                />
                <button className="login-submit" type="submit" disabled={parseUserName(name).length < 1}>
                    Continue
                </button>
                <button className="login-helper" type="button" onClick={() => navigate(-1)}>
                    Back
                </button>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default Login;
