import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import TextInputEffectLabel from '../components/TextInputEffectLabel';
import { deleteAccount } from '../api/institutes';
import { AuthContext } from '../context/AuthContext';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { getStoreData } from '../utils/AsyncStorage';
import ToggleDialog from '../components/ToggleDialog';

const DeleteAccountScreen = () => {
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { logoutAuthContext } = useContext(AuthContext);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        let error = '';
        if (field === 'email' && value.trim() === '') {
            error = 'Email is required';
        } else if (field === 'email' && !isValidEmail(value)) {
            error = 'Invalid email address.';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const validateNullFormData = (formData) => {
        let isValid = true;
        if (formData.email.trim() === '') {
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            isValid = false;
        }
        return isValid;
    };

    useEffect(() => {
        const validate = validateNullFormData(formData);
        setIsValid(validate);
    }, [formData]);

    const handleSubmit = async () => {
        const confirmEmail = formData.email;
        const userInfo = await getStoreData('userInfo');
        const { email } = JSON.parse(userInfo);
        if (validateNullFormData(formData)) {
            try {
                if (confirmEmail === email) {
                    setIsLoading(true);
                    const response = await deleteAccount(email);
                    const { code, message, data } = response;
                    if (code == 200) {
                        await logoutAuthContext();
                        alert(message)
                    } else {
                        alert(message)
                    }
                } else {
                    alert('Your email is incorrect')
                }
            } catch (error) {
                alert('Account Deletion Unsuccessful')
                return;
            } finally {
                setIsDialogVisible(false);
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAnimatedLoader visible={isLoading} />
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInputEffectLabel
                        label="Email"
                        onChangeText={(text) => handleInputChange('email', text)}
                        value={formData.email}
                        error={errors.email}
                        style={styles.input}
                    />
                    {isValid && (
                        <Text style={styles.text}>
                            You are attempting to delete your FUXI Music App account. Since this account is essential for accessing various features
                            of the app, deleting it will result in the loss of access to all functionalities. Your account and associated data will be
                            permanently deleted.
                        </Text>
                    )}
                    <View style={styles.toggle}>
                        <TouchableOpacity
                            style={[
                                styles.toggleActive,
                                {
                                    backgroundColor: !isValid ? '#EFEFF1' : '#E84C4C',
                                },
                            ]}
                            onPress={() => setIsDialogVisible(true)}
                            disabled={!isValid}
                        >
                            <Text
                                style={[
                                    styles.activeText,
                                    {
                                        color: !isValid ? '#CACECE' : '#fff',
                                    },
                                ]}
                            >
                                Delete acoount
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ToggleDialog
                    visible={isDialogVisible}
                    title="Delete Account"
                    desc="Are you sure you want to proceed? This action cannot be undone."
                    labelYes="Yes, Delete"
                    labelNo="No, Cancel"
                    onPressYes={handleSubmit}
                    onPressNo={() => setIsDialogVisible(false)}
                    styleBtnYes={{ backgroundColor: '#E84C4C' }}
                />
            </View>
        </SafeAreaView>
    );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
    },
    form: {
        marginTop: 16,
    },
    input: { marginBottom: 0 },
    toggle: {
        marginTop: 20,
    },
    toggleActive: {
        borderRadius: 100,
    },
    activeText: {
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    text: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
