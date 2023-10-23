import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlayMedia from '../screens/PlayMedia';
import TabNavigator from './TabNavigator';
import PlaylistDetailsScreen from './../screens/PlaylistDetailsScreen';
import LikedSongsScreen from '../screens/LikedSongsScreen';
import SearchTrackScreen from '../screens/SearchTrackScreen';
import CreateNewPlaylistScreen from '../screens/CreateNewPlaylistScreen';
import RateSongsScreen from '../screens/RateSongsScreen';
import OverlayMediaScreen from '../screens/OverlayMediaScreen';
import AllListenerProfilesScreen from '../screens/AllListenerProfilesScreen';
import ProfileDetailNavigator from './ProfileDetailNavigator';
import EditProfileNavigator from './EditProfileNavigator';
import AboutFUXI from '../screens/other/AboutFUXI';
import TermsAndConditions from '../screens/other/TermsAndConditions';
import PrivacyPolicy from '../screens/other/PrivacyPolicy';

const Stack = createNativeStackNavigator();

const AppStack = () => {
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
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EditProfileNavigator"
                component={EditProfileNavigator}
                options={{
                    headerShown: false,
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
        </Stack.Navigator>
    );
};

export default AppStack;
