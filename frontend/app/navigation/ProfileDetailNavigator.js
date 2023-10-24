import React from 'react';
import { StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BasicInformationScreen from '../screens/profile-detail-screen/BasicInformationScreen';
import DislikedSongsScreen from '../screens/profile-detail-screen/DislikedSongsScreen';
import MusicTasteScreen from '../screens/profile-detail-screen/MusicTasteScreen';

const Tab = createMaterialTopTabNavigator();

const ProfileDetailNavigator = () => {
    return (
        <Tab.Navigator
            style={{ paddingTop: StatusBar.currentHeight, backgroundColor: '#fff' }}
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    textTransform: 'capitalize',
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 20,
                    margin: 0,
                },
                tabBarActiveTintColor: '#137882',
                tabBarInactiveTintColor: '#3C4647',
                tabBarIndicatorStyle: {
                    backgroundColor: '#137882',
                },
                tabBarItemStyle: {
                    padding: 0,
                    margin: 0,
                },
                tabBarPressColor: '#fff',
                tabBarStyle: {
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    elevation: 0,
                    borderBottomColor: '#FEF7FF',
                    borderBottomWidth: 1,
                },
                android_ripple: null,
            }}
        >
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
