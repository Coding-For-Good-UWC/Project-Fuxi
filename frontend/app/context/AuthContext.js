import React, { createContext, useEffect, useState } from 'react';
import { deleteData, getStoreData, storeData } from '../utils/AsyncStorage';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [userToken, setUserToken] = useState(null);

    const loginAuthContext = async (token) => {
        await storeData('userToken', token);
        setUserToken(token);
    };

    const logoutAuthContext = async () => {
        await deleteData('userToken');
        setUserToken(null);
    };

    const isLoggedIn = async () => {
        try {
            let userToken = await getStoreData('userToken');
            setUserToken(userToken);
        } catch (error) {
            console.error('isLogged in error: ', error);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return <AuthContext.Provider value={{ loginAuthContext, logoutAuthContext, userToken }} {...props}></AuthContext.Provider>;
};
