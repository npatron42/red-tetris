/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useHistory.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 14:20:43 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 13:11:24 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useCallback, useEffect, useState } from "react";
import { getUser } from "./useApi";

export const useHistory = () => {
    const [matchHistory, setMatchHistory] = useState([]);
    const [soloGameHistory, setSoloGameHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getUser();
            if (response.success && response.user) {
                setMatchHistory(response.user.matchHistory || []);
                setSoloGameHistory(response.user.soloGameHistory || []);
            }
        } catch (error) {
            setError(error.message || "Failed to fetch history");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserHistory();
    }, [fetchUserHistory]);

    return {
        matchHistory,
        soloGameHistory,
        isLoading,
        error,
        refetch: fetchUserHistory,
    };
};
