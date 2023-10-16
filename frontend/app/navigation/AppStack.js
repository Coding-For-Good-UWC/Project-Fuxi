import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PlayMedia from '../screens/PlayMedia';
import TabNavigator from './TabNavigator';
import PlaylistDetailsScreen from './../screens/PlaylistDetailsScreen';
import LikedSongsScreen from '../screens/LikedSongsScreen';
import ModalSearchScreen from '../screens/ModalSearchScreen';
import CreateNewPlaylistScreen from '../screens/CreateNewPlaylistScreen';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{ headerTitle: '', headerTransparent: true, headerShown: false }}
            />
            <Stack.Screen
                name="PlayMedia"
                component={PlayMedia}
                options={{ headerTitle: '', headerTransparent: true, presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="PlaylistDetailsScreen"
                component={PlaylistDetailsScreen}
                options={{ headerTransparent: true }}
            />
            <Stack.Screen
                name="LikedSongsScreen"
                component={LikedSongsScreen}
                options={{ headerTitle: '', headerTransparent: true }}
            />
            <Stack.Screen
                name="ModalSearchScreen"
                component={ModalSearchScreen}
                options={{ headerTitle: '', headerTransparent: true, headerShown: false }}
            />
            <Stack.Screen
                name="CreateNewPlaylistScreen"
                component={CreateNewPlaylistScreen}
                options={{ headerTitle: '', headerTransparent: true }}
            />
        </Stack.Navigator>
    );
};

export default AppStack;
