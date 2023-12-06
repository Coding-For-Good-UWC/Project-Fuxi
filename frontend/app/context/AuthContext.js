import React, { createContext, useEffect, useState } from 'react';
import { deleteData, getStoreData, storeData } from '../utils/AsyncStorage';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const loginAuthContext = async (token) => {
        setIsLoading(true);
        await storeData('userToken', token);
        setUserToken(token);
        setIsLoading(false);
    };

    const logoutAuthContext = async () => {
        await deleteData('userToken');
        await deleteData('userInfo');
        await deleteData('profile0');
        setUserToken(null);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await getStoreData('userToken');
            setUserToken(userToken);
        } catch (error) {
            console.error('isLogged in error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return <AuthContext.Provider value={{ loginAuthContext, logoutAuthContext, isLoading, userToken }} {...props}></AuthContext.Provider>;
};
