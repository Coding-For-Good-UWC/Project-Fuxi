import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlayMedia from '../screens/PlayMedia';
import TabNavigator from './TabNavigator';
import PlaylistDetailsScreen from './../screens/PlaylistDetailsScreen';
import LikedSongsScreen from '../screens/LikedSongsScreen';
import SearchTrackScreen from '../screens/SearchTrackScreen';
import CreateNewPlaylistScreen from '../screens/CreateNewPlaylistScreen';
import RateSongsScreen from '../screens/other/RateSongsScreen';
import OverlayMediaScreen from '../screens/OverlayMediaScreen';
import AllListenerProfilesScreen from '../screens/AllListenerProfilesScreen';
import ProfileDetailNavigator from './ProfileDetailNavigator';
import EditProfileNavigator from './EditProfileNavigator';
import AboutFUXI from '../screens/other/AboutFUXI';
import TermsAndConditions from '../screens/other/TermsAndConditions';
import PrivacyPolicy from '../screens/other/PrivacyPolicy';
import ResetPassword from '../screens/reset-password/ResetPassword';
import ResetPasswordCheckEmail from '../screens/reset-password/ResetPasswordCheckEmail';
import ResetPasswordNew from '../screens/reset-password/ResetPasswordNew';
import { useNavigation } from '@react-navigation/core';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator>
            <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerTitle: '', headerTransparent: true, headerShown: false }} />
            <Stack.Screen
                name="PlayMedia"
                component={PlayMedia}
                options={{ headerTitle: '', headerTransparent: true, presentation: 'fullScreenModal' }}
            />
            <Stack.Screen name="PlaylistDetailsScreen" component={PlaylistDetailsScreen} options={{ headerTransparent: true }} />
            <Stack.Screen name="LikedSongsScreen" component={LikedSongsScreen} options={{ headerTitle: '', headerTransparent: true }} />
            <Stack.Screen
                name="SearchTrackScreen"
                component={SearchTrackScreen}
                options={{ headerTitle: '', headerTransparent: true, headerShown: false }}
            />
            <Stack.Screen name="CreateNewPlaylistScreen" component={CreateNewPlaylistScreen} options={{ headerTitle: '', headerTransparent: true }} />
            <Stack.Screen
                name="RateSongsScreen"
                component={RateSongsScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="OverlayMediaScreen"
                component={OverlayMediaScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="AllListenerProfilesScreen"
                component={AllListenerProfilesScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="ProfileDetailNavigator"
                component={ProfileDetailNavigator}
                options={{
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Stack.Screen
                name="EditProfileNavigator"
                component={EditProfileNavigator}
                options={{
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
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
                name="TermsAndConditions"
                component={TermsAndConditions}
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
                name="PrivacyPolicy"
                component={PrivacyPolicy}
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
                name="ResetPassword"
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            >
                {() => <ResetPassword labelHeader={'Change password'} />}
            </Stack.Screen>
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
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            >
                {() => <ResetPasswordNew navigationTo={() => navigation.navigate('TabNavigator')} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AppStack;
