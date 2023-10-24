import React from 'react';
import { StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EditBaseInformationScreen from '../screens/profile-detail-screen/EditBaseInformationScreen';
import EditMusicTasteScreen from '../screens/profile-detail-screen/EditMusicTasteScreen';

const Tab = createMaterialTopTabNavigator();

const EditProfileNavigator = () => {
    return (
        <Tab.Navigator
            style={{ paddingTop: StatusBar.currentHeight, backgroundColor: '#fff' }}
            screenOptions={{
                tabBarScrollEnabled: false,
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
