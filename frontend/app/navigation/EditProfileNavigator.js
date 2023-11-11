import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Dimensions, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import EditBaseInformationScreen from '../screens/profile-detail-screen/EditBaseInformationScreen';
import EditMusicTasteScreen from '../screens/profile-detail-screen/EditMusicTasteScreen';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { getStoreData, storeData } from '../utils/AsyncStorage';
import { createProfile, updateProfile } from '../api/profiles';
import { AppContext } from '../context/AppContext';
import { createProfileReact } from '../api/profileReact';

const Tab = createMaterialTopTabNavigator();

const EditProfileNavigator = () => {
    const { isReRender, setIsReRender } = useContext(AppContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [dataProfile, setDataProfile] = useState(route.params?.dataProfileItem || {});
    const [selectedItems, setSelectedItems] = useState(route.params?.dataProfileItem?.genres || []);
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nameListener: '',
        yearBirth: '',
    });

    const [errors, setErrors] = useState({
        nameListener: '',
        yearBirth: '',
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: dataProfile.fullname || 'Create new profile',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: Platform.OS === 'android' ? 20 : 0, padding: 5 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleSubmit = async () => {
        const { nameListener, yearBirth } = formData;
        if (validateNullFormData(formData)) {
            alert('Please fix the validation errors');
            return;
        }
        setIsLoading(true);

        if (Object.keys(dataProfile).length !== 0) {
            try {
                const response = await updateProfile(dataProfile._id, nameListener, yearBirth, selectedItems);
                const { code, message } = response;
                if (code == 200) {
                    navigation.navigate('AllListenerProfilesScreen');
                    setIsReRender(!isReRender);
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error:', error);
                return;
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const userInfo = await getStoreData('userInfo');
                const { uid } = JSON.parse(userInfo);
                const newProfile = await createProfile(uid, nameListener, yearBirth, selectedItems);
                const { code, message, data } = newProfile;
                await createProfileReact(data._id, []);
                if (code == 201) {
                    await storeData('profile0', JSON.stringify(data));
                    navigation.navigate('AllListenerProfilesScreen');
                    setIsReRender(!isReRender);
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error:', error);
                return;
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateNullFormData = (formData) => {
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                if (formData[key] === null || formData[key] === '') {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (formData.nameListener.length < 6 || selectedItems.length < 1) {
            setIsValid(false);
        } else {
            validateNullFormData(formData) ? setIsValid(false) : setIsValid(true);
        }
    }, [formData, errors, selectedItems]);

    return (
        <View style={styles.container}>
            <CustomAnimatedLoader visible={isLoading} />
            <Tab.Navigator
                style={{ backgroundColor: '#fff' }}
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
                    options={{
                        title: 'Basic information',
                    }}
                >
                    {() => (
                        <EditBaseInformationScreen
                            formData={
                                Object.keys(dataProfile).length !== 0
                                    ? { nameListener: dataProfile.fullname, yearBirth: new Date(dataProfile.yearBirth).getUTCFullYear() }
                                    : formData
                            }
                            setFormData={setFormData}
                            errors={errors}
                            setErrors={setErrors}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen
                    name="EditMusicTasteScreen"
                    options={{
                        title: 'Music taste',
                    }}
                >
                    {() => <EditMusicTasteScreen selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
                </Tab.Screen>
            </Tab.Navigator>
            <View style={styles.bottomButton}>
                <View style={styles.bottomButtonWrapper}>
                    <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => navigation.goBack()}>
                        <Text style={[styles.buttonText, { color: '#4A4D4F' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isValid ? '#315F64' : '#EFEFF1' }]}
                        disabled={!isValid}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={[styles.buttonText, { color: isValid ? '#fff' : '#CACECE' }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default EditProfileNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        backgroundColor: '#fff',
    },
    bottomButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: 90,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomButtonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 20,
    },
    button: {
        flex: 1,
        lineHeight: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    buttonText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        paddingVertical: 12,
    },
    buttonCancel: {
        borderWidth: 1,
        borderColor: '#ECEDEE',
    },
});
