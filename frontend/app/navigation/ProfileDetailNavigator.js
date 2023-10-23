import React from 'react';
import { StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BasicInformationScreen from '../screens/profile-detail-screen/BasicInformationScreen';
import DislikedSongsScreen from '../screens/profile-detail-screen/DislikedSongsScreen';
import MusicTasteScreen from '../screens/profile-detail-screen/MusicTasteScreen';

const Tab = createMaterialTopTabNavigator();

const ProfileDetailNavigator = () => {
    return (
        <Tab.Navigator style={{ paddingTop: StatusBar.currentHeight, backgroundColor: '#fff' }}>
            <Tab.Screen
                name="BasicInformationScreen"
                component={BasicInformationScreen}
                options={{
                    title: 'Basic information',
                }}
            />
            <Tab.Screen
                name="MusicTasteScreen"
                component={MusicTasteScreen}
                options={{
                    title: 'Music taste',
                }}
            />
            <Tab.Screen
                name="DislikedSongsScreen"
                component={DislikedSongsScreen}
                options={{
                    title: 'Disliked songs',
                }}
            />
        </Tab.Navigator>
    );
};

export default ProfileDetailNavigator;
