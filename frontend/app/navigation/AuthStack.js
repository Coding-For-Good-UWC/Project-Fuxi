import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import AboutFUXI from '../screens/other/AboutFUXI';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import SignInScreen from '../screens/SignInScreen';
import ListenerProfileMain from '../screens/listener-profile-new-account/ListenerProfileMain';
import ListenerProfileScreen3 from '../screens/listener-profile-new-account/ListenerProfileScreen3';
import ResetPassword from '../screens/reset-password/ResetPassword';
import ResetPasswordCheckEmail from '../screens/reset-password/ResetPasswordCheckEmail';
import ResetPasswordNew from '../screens/reset-password/ResetPasswordNew';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="AboutFUXI"
                component={AboutFUXI}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="CreateAccountScreen"
                component={CreateAccountScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ListenerProfileMain"
                component={ListenerProfileMain}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ListenerProfileScreen3"
                component={ListenerProfileScreen3}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="ResetPasswordCheckEmail"
                component={ResetPasswordCheckEmail}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="ResetPasswordNew"
                component={ResetPasswordNew}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
