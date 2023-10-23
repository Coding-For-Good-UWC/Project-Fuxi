import React from 'react';
import { StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EditBaseInformationScreen from '../screens/profile-detail-screen/EditBaseInformationScreen';
import EditMusicTasteScreen from '../screens/profile-detail-screen/EditMusicTasteScreen';

const Tab = createMaterialTopTabNavigator();

const EditProfileNavigator = () => {
    return (
        <Tab.Navigator style={{ paddingTop: StatusBar.currentHeight, backgroundColor: '#fff' }}>
            <Tab.Screen
                name="EditBaseInformationScreen"
                component={EditBaseInformationScreen}
                options={{
                    title: 'Basic information',
                }}
            />
            <Tab.Screen
                name="EditMusicTasteScreen"
                component={EditMusicTasteScreen}
                options={{
                    title: 'Music taste',
                }}
            />
        </Tab.Navigator>
    );
};

export default EditProfileNavigator;
