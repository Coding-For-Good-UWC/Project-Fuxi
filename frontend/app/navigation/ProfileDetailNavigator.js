import React, { useLayoutEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import BasicInformationScreen from '../screens/profile-detail-screen/BasicInformationScreen';
import DislikedSongsScreen from '../screens/profile-detail-screen/DislikedSongsScreen';
import MusicTasteScreen from '../screens/profile-detail-screen/MusicTasteScreen';
import ToggleDialog from '../components/ToggleDialog';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { deleteAllPlaylist } from '../api/playlist';
import { deleteProfileReact } from '../api/profileReact';
import { deleteProfile } from '../api/profiles';
import { getStoreData } from '../utils/AsyncStorage';

const Tab = createMaterialTopTabNavigator();

const ProfileDetailNavigator = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [dataProfile, setDataProfile] = useState(route.params?.dataProfileItem || {});
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isDialogDelete, setIsDialogDelete] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const handleShowDialogDelete = () => {
        setIsDialogDelete(!isDialogDelete);
    };

    const handleSubmitDelete = async () => {
        const profile0 = await getStoreData('profile0');
        if (profile0 !== null) {
            const { _id } = JSON.parse(profile0);
            if (_id !== dataProfile._id) {
                setIsLoading(true);
                try {
                    setIsDialogDelete(false);
                    const { _id } = dataProfile;
                    await deleteAllPlaylist(_id);
                    await deleteProfileReact(_id);
                    await deleteProfile(_id);
                    navigation.navigate('AllListenerProfilesScreen');
                    alert('Delete profile successfully');
                } catch (error) {
                    alert('Profile deletion failed');
                    console.error('Error:', error);
                    return;
                } finally {
                    setIsLoading(false);
                }
            } else {
                alert('You are in this profile and you cannot delete it');
            }
        } else {
            alert('Please create a profile to use this feature');
        }
        setIsDialogDelete(false);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: dataProfile.fullname || '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: Platform.OS === 'android' ? 20 : 0, padding: 5 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={26} color={'#3C4647'} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={{ padding: 3 }} onPress={() => handleShowDialogDelete()}>
                    <Ionicons name="trash-outline" size={24} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0), backgroundColor: '#fff' }}>
            <CustomAnimatedLoader visible={isLoading} />
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
                    options={{
                        title: 'Basic information',
                    }}
                >
                    {() => <BasicInformationScreen dataProfile={dataProfile} />}
                </Tab.Screen>
                <Tab.Screen
                    name="MusicTasteScreen"
                    options={{
                        title: 'Music taste',
                    }}
                >
                    {() => <MusicTasteScreen dataProfile={dataProfile} />}
                </Tab.Screen>
                <Tab.Screen
                    name="DislikedSongsScreen"
                    options={{
                        title: 'Disliked songs',
                    }}
                >
                    {() => <DislikedSongsScreen setIsDialogVisible={setIsDialogVisible} setDialogProps={setDialogProps} dataProfile={dataProfile} />}
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
            <ToggleDialog
                visible={isDialogDelete}
                title={`Delete profile "${dataProfile.fullname}”?`}
                desc={'This profile will be deleted immediately. This can’t be undone.'}
                labelYes={'Delete'}
                labelNo={'No, go back'}
                onPressYes={() => handleSubmitDelete()}
                onPressNo={() => setIsDialogDelete(!isDialogDelete)}
                styleBtnYes={{ backgroundColor: '#E84C4C' }}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('EditProfileNavigator', { dataProfileItem: dataProfile })}
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
