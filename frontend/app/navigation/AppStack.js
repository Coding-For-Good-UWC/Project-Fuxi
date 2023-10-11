import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LibrariesScreen from '../screens/LibrariesScreen';
import PlayMedia from '../screens/PlayMedia';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
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
                name="PlayMedia"
                component={PlayMedia}
                options={{
                    headerTitle: "Nina's playlist",
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
};

export default AppStack;
