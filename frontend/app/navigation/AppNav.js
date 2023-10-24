import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

const AppNav = () => {
    const { userToken } = useContext(AuthContext);
    return <NavigationContainer>{userToken !== null ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};

export default AppNav;
