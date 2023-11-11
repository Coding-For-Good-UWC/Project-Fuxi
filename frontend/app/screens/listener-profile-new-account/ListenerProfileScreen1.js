import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import SelectElementEffectLabel from '../../components/SelectElementEffectLabel';
import { listArrayObjectYear } from '../../utils/utils';

const ListenerProfileScreen1 = ({ goToScreen, formData, setFormData, errors, setErrors }) => {
    const [isValid, setIsValid] = useState(false);
    const updateFormData = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const validateField = (field, value) => {
        let error = '';
        if (field === 'nameListener' && value === '') {
            error = 'Name is required.';
        } else if (field === 'nameListener' && value.trim().length < 6) {
            error = 'Name must be at least 6 characters.';
        } else if (field === 'yearBirth' && value === '') {
            error = 'Year of birth is required.';
        }
        return error;
    };

    const handleChangeValue = (field, value) => {
        updateFormData(field, value);
        const error = validateField(field, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    useEffect(() => {
        if (formData.nameListener.length < 6) {
            setIsValid(false);
        } else {
            validateNullFormData(formData) ? setIsValid(false) : setIsValid(true);
        }
    }, [formData, errors]);

    const handleSubmit = () => {
        if (validateNullFormData(formData)) {
            alert('Please fix the validation errors');
            return;
        }
        goToScreen();
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

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Set up listener profile</Text>
            <Text style={styles.descriptionText}>
                In order for us to personalize our music therapy for the listener, please help us understand a bit about them.
            </Text>
            <View style={styles.formProfile}>
                <TextInputEffectLabel
                    label="Name"
                    onChangeText={(text) => handleChangeValue('nameListener', text)}
                    value={formData.nameListener}
                    error={errors.nameListener}
                />
                <SelectElementEffectLabel
                    dataArrayObject={listArrayObjectYear()}
                    label="Year of birth"
                    onValueChange={(text) => handleChangeValue('yearBirth', text)}
                    value={formData.yearBirth}
                    error={errors.yearBirth}
                />
            </View>
            <TouchableOpacity
                style={[
                    styles.toggleActive,
                    {
                        backgroundColor: isValid ? '#315F64' : '#EFEFF1',
                    },
                ]}
                onPress={handleSubmit}
                disabled={!isValid}
            >
                <Text
                    style={[
                        styles.activeText,
                        {
                            color: isValid ? '#fff' : '#CACECE',
                        },
                    ]}
                >
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ListenerProfileScreen1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        padding: 30,
    },
    headerText: {
        fontSize: 24,
        color: '#222C2D',
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 32,
    },
    descriptionText: {
        fontSize: 16,
        color: '#3C4647',
        fontWeight: '400',
        lineHeight: 24,
        marginBottom: 20,
    },
    formProfile: {
        flexDirection: 'column',
        gap: 16,
        marginBottom: 32,
    },
    toggleActive: {
        borderRadius: 100,
        marginTop: 32,
    },
    activeText: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});
