import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import LandingScreen from './app/screens/LandingScreen';

import LoginScreen from './app/screens/LoginScreen';
import ManualPlayerScreen from './app/screens/ManualPlayerScreen';
import SignupScreen from './app/screens/SignupScreen';
import PlayerScreen from './app/screens/PlayerScreen';
import PrePlayerScreen from './app/screens/PrePlayerScreen';
import ShuffleManual from './app/screens/ShuffleManual';
import YoutubeManual from './app/screens/YoutubeManualPlayer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PatientDashboard from './app/screens/PatientDashboard';

import PatientRegistration from './app/screens/PatientRegistration';
import PatientMusicForm from './app/screens/PatientMusicForm';

import LoadingContext from './app/store/LoadingContext';
import LoadingScreen from './app/components/LoadingScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';

import './firebaseConfig';
import AboutFUXI from './app/screens/AboutFUXI';
import PlayMedia from './app/screens/PlayMedia';
import CreateAccountScreen from './app/screens/CreateAccountScreen';
import ListenerProfileMain from './app/screens/ListenerProfileMain';
import ListenerProfileScreen1 from './app/screens/ListenerProfileScreen1';
import ListenerProfileScreen3 from './app/screens/ListenerProfileScreen3';
import SignInScreen from './app/screens/SignInScreen';
import ResetPassword from './app/screens/ResetPassword';
import ResetPasswordCheckEmail from './app/screens/ResetPasswordCheckEmail';
import ResetPasswordNew from './app/screens/ResetPasswordNew';
import LibrariesScreen from './app/screens/LibrariesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const isLoadingContextValue = useMemo(() => ({ isLoading, setIsLoading }), [isLoading, setIsLoading]);

    useEffect(() => {
        if (isLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, fadeAnim]);

    return (
        <View style={styles.container}>
            <LoadingContext.Provider value={isLoadingContextValue}>
                <NavigationContainer>
                    <Stack.Navigator>
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
                            }}
                        />
                        <Stack.Screen
                            name="PlayMedia"
                            component={PlayMedia}
                            options={{
                                headerTitle: "Nina's playlist",
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignupScreen}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="Dashboard"
                            component={PatientDashboard}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="PatientRegistration"
                            component={PatientRegistration}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="PatientMusicForm"
                            component={PatientMusicForm}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="Player"
                            component={PlayerScreen}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />

                        <Stack.Screen
                            name="PrePlayer"
                            component={PrePlayerScreen}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="ManualPlayer"
                            component={ManualPlayerScreen}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="YoutubeManual"
                            component={YoutubeManual}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                            }}
                        />
                        <Stack.Screen
                            name="ShuffleManual"
                            component={ShuffleManual}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
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
                            name="ListenerProfileScreen1"
                            component={ListenerProfileScreen1}
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
                            name="LibrariesScreen"
                            component={LibrariesScreen}
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
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="ResetPasswordCheckEmail"
                            component={ResetPasswordCheckEmail}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="ResetPasswordNew"
                            component={ResetPasswordNew}
                            options={{
                                headerTitle: '',
                                headerTransparent: true,
                                headerShown: false,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </LoadingContext.Provider>
            {isLoading && <LoadingScreen fadeAnim={fadeAnim} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
