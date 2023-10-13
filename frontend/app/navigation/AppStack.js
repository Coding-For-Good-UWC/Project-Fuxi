import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlayMedia from '../screens/PlayMedia';
import TabNavigator from './TabNavigator';
import PlaylistDetailsScreen from './../screens/PlaylistDetailsScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerShown: false,
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
            <Stack.Screen
                name="PlaylistDetailsScreen"
                component={PlaylistDetailsScreen}
                options={{
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
};

export default AppStack;
