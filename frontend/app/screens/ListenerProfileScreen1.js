import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import TextInputEffectLabel from '../components/TextInputEffectLabel';
import SelectElementEffectLabel from '../components/SelectElementEffectLabel';
import { languages } from './PatientRegistration';

const ListenerProfileScreen1 = () => {
    const [isValid, setIsValid] = useState(false);
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

    const years = [];
    years.push('');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        years.push(year.toString());
    }

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
        } else if (field === 'yearBirth' && value === '') {
            error = 'Year of birth is required.';
        } else if (field === 'language' && value === '') {
            error = 'Language is required.';
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
        console.log();
        if (validateNullFormData(formData)) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    };

    const handleSubmit = () => {
        const { nameListener, yearBirth, language } = formData;

        // if (validateNullFormData(formData)) {
        //     alert('Please fix the validation errors');
        //     return;
        // }

        console.log('Name:', nameListener);
        console.log('Year of birth:', yearBirth);
        console.log('Language:', language);
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
                In order for us to personalize our music therapy for the
                listener, please help us understand a bit about them.
            </Text>
            <View style={styles.formProfile}>
                <TextInputEffectLabel
                    label="Name"
                    onChangeText={(text) =>
                        handleChangeValue('nameListener', text)
                    }
                    value={formData.nameListener}
                    error={errors.nameListener}
                />
                <SelectElementEffectLabel
                    dataArray={years}
                    label="Year of birth"
                    onValueChange={(text) =>
                        handleChangeValue('yearBirth', text)
                    }
                    value={formData.yearBirth}
                    error={errors.yearBirth}
                />
                <SelectElementEffectLabel
                    dataArray={languages}
                    label="Preferred language"
                    onValueChange={(text) =>
                        handleChangeValue('language', text)
                    }
                    value={formData.language}
                    error={errors.language}
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
        color: '#222C2D',
        lineHeight: 24,
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
