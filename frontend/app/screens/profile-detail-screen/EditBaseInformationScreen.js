import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import SelectElementEffectLabel from '../../components/SelectElementEffectLabel';

const EditBaseInformationScreen = ({ formData, setFormData, errors, setErrors }) => {
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerDesc}>These information helps us personalize our music therapy for the listener.</Text>
                <View style={styles.formProfile}>
                    <TextInputEffectLabel label="Name" onChangeText={(text) => handleChangeValue('nameListener', text)} error={errors.nameListener} />
                    <SelectElementEffectLabel
                        dataArray={years}
                        label="Year of birth"
                        onValueChange={(text) => handleChangeValue('yearBirth', text)}
                        error={errors.yearBirth}
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
