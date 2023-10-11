import React, { createContext, useEffect, useState } from 'react';
import { deleteData, getStoreData, storeData } from '../utils/AsyncStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const loginAuthContext = async (token) => {
        setIsLoading(true);
        await storeData('userToken', token);
        setUserToken(token);
        setIsLoading(false);
    };

    const logoutAuthContext = async () => {
        setIsLoading(true);
        await deleteData('userToken');
        setUserToken(null);
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await getStoreData('userToken');
            setUserToken(userToken);
            setIsLoading(false);
        } catch (error) {
            console.error('isLogged in error: ', error);
        }
    };

    useEffect(() => {
        isLoggedIn();
        console.log(userToken);
    }, []);

    return (
        <AuthContext.Provider value={{ loginAuthContext, logoutAuthContext, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};
