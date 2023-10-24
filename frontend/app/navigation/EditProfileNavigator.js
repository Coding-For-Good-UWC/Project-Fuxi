import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Dimensions, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import EditBaseInformationScreen from '../screens/profile-detail-screen/EditBaseInformationScreen';
import EditMusicTasteScreen from '../screens/profile-detail-screen/EditMusicTasteScreen';

const Tab = createMaterialTopTabNavigator();

const EditProfileNavigator = () => {
    const navigation = useNavigation();
    const [isValid, setIsValid] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const [formData, setFormData] = useState({
        nameListener: '',
        yearBirth: '',
        language: '',
    });

    const [errors, setErrors] = useState({
        nameListener: '',
        yearBirth: '',
        language: '',
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: 'ninaazarova',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: Platform.OS === 'android' ? 20 : 0, padding: 5 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleSubmit = () => {
        const { nameListener, yearBirth, language } = formData;

        if (validateNullFormData(formData)) {
            alert('Please fix the validation errors');
            return;
        }
        console.log(formData, selectedItems);
        showToastMessage('Profile updated');
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
                    {() => <EditBaseInformationScreen formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
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
        bottom: 20,
        right: 20,
        width: Dimensions.get('screen').width - 40,
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
