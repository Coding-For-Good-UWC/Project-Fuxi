import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import SelectElementEffectLabel from '../../components/SelectElementEffectLabel';
import { countries } from '../../utils/Diversity';

const EditBaseInformationScreen = () => {
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
        } else if (field === 'nameListener' && value.length < 6) {
            error = 'Name must be at least 6 characters.';
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
    };

    useEffect(() => {
        if (formData.nameListener.length < 6) {
            setIsValid(false);
        } else {
            validateNullFormData(formData) ? setIsValid(false) : setIsValid(true);
        }
    }, [formData, errors]);

    const handleSubmit = () => {
        const { nameListener, yearBirth, language } = formData;

        if (validateNullFormData(formData)) {
            alert('Please fix the validation errors');
            return;
        }

        console.log('formData:', formData);
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerDesc}>These information helps us personalize our music therapy for the listener.</Text>
                <View style={styles.formProfile}>
                    <TextInputEffectLabel
                        label="Name"
                        onChangeText={(text) => handleChangeValue('nameListener', text)}
                        value={formData.nameListener}
                        error={errors.nameListener}
                    />
                    <SelectElementEffectLabel
                        dataArray={years}
                        label="Year of birth"
                        onValueChange={(text) => handleChangeValue('yearBirth', text)}
                        value={formData.yearBirth}
                        error={errors.yearBirth}
                    />
                    <SelectElementEffectLabel
                        dataArray={countries}
                        label="Preferred language"
                        onValueChange={(text) => handleChangeValue('language', text)}
                        value={formData.language}
                        error={errors.language}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default EditBaseInformationScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 20,
    },
    formProfile: {
        flexDirection: 'column',
        gap: 16,
    },
    headerDesc: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
