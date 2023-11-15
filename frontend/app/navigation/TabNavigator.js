import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LibraryScreen from '../screens/LibraryScreen';
import SettingScreen from '../screens/SettingScreen';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#fff', shadowColor: '#fff', height: 80 },
                tabBarActiveTintColor: '#222C2D',
                tabBarInactiveTintColor: '#3C4647',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 10,
                },
            }}
        >
            <Tab.Screen
                name="LibraryScreen"
                component={LibraryScreen}
                // options={{
                //     tabBarLabel: 'Library',
                //     tabBarIcon: ({color}) => <Ionicons name="musical-note" color={color} size={26} />
                // }}
                options={({ route }) => ({
                    tabBarLabel: 'Library',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            style={[
                                styles.iconTab,
                                {
                                    backgroundColor: focused ? '#ECEDEE' : 'transparent',
                                },
                            ]}
                            name="musical-note"
                            color={color}
                            size={26}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            style={[
                                styles.iconTab,
                                {
                                    backgroundColor: focused ? '#ECEDEE' : 'transparent',
                                },
                            ]}
                            name="settings"
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;

const styles = StyleSheet.create({
    iconTab: {
        borderRadius: 20,
    },
});
