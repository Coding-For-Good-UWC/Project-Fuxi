import React, { useLayoutEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import BasicInformationScreen from '../screens/profile-detail-screen/BasicInformationScreen';
import DislikedSongsScreen from '../screens/profile-detail-screen/DislikedSongsScreen';
import MusicTasteScreen from '../screens/profile-detail-screen/MusicTasteScreen';
import ToggleDialog from '../components/ToggleDialog';

const Tab = createMaterialTopTabNavigator();

const ProfileDetailNavigator = () => {
    const navigation = useNavigation();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: 'ninaazarova',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: Platform.OS === 'android' ? 20 : 0, padding: 5 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={26} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0), backgroundColor: '#fff' }}>
            <Tab.Navigator
                style={{ backgroundColor: '#fff' }}
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
                    options={{
                        title: 'Disliked songs',
                    }}
                >
                    {() => <DislikedSongsScreen setIsDialogVisible={setIsDialogVisible} setDialogProps={setDialogProps} />}
                </Tab.Screen>
            </Tab.Navigator>
            <ToggleDialog
                visible={isDialogVisible}
                title={dialogProps.title}
                desc={dialogProps.desc}
                labelYes={dialogProps.labelYes}
                labelNo={dialogProps.labelNo}
                onPressYes={dialogProps.onPressYes}
                onPressNo={dialogProps.onPressNo}
                styleBtnYes={dialogProps.styleBtnYes}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('EditProfileNavigator')}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: Dimensions.get('screen').width - 40,
                    backgroundColor: '#EEF8F9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                }}
            >
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 16,
                        lineHeight: 24,
                        color: '#222C2D',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                    }}
                >
                    Edit
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileDetailNavigator;
