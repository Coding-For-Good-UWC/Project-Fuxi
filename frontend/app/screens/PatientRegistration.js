import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePickerModal from '../components/DatePickerModal';
import colours from '../config/colours.js';
import StyledButton from '../components/StyledButton';

export const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
];

export const languages = [
    'Chinese',
    'English',
    'Hindi',
    'Tamil',
    'Cantonese',
    'Hainanese',
    'Hokkien',
    'Mandarin',
];

export const ethnicities = [
    'Singaporean',
    'Malaysian',
    'Indian',
    'Chinese',
    'Eurasian',
    'Hokkien',
];

const PatientRegistration = ({ route, navigation }) => {
    const [formData, setFormData] = useState({
        name: '',
        ethnicity: '',
        birthdate: '',
        birthplace: '',
        language: '',
    });

    const renderPickerSelect = (selectedValue, onValueChange, items) => (
        <View style={styles.inputContainer}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue, itemIndex) => {
                    onValueChange(itemValue);
                }}
                style={styles.pickerSelectStyles}
            >
                <Picker.Item label="Select" value={null} />
                {items.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                ))}
            </Picker>
        </View>
    );

    const [datePickerModalActive, setDatePickerModalActive] = useState(false);

    const handleChange = (value, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        const { name, ethnicity, birthdate, birthplace, language } = formData;

        if (!name || !ethnicity || !birthdate || !birthplace || !language) {
            Alert.alert('Please fill in all fields.');
            return;
        }

        const birthDateObj = new Date(birthdate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }

        const patientData = {
            name,
            age,
            birthdate,
            ethnicity,
            birthplace,
            language,
        };
        navigation.navigate('PatientMusicForm', { ...patientData });
    };

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.title}>New Listener</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor={colours.selected}
                            onChangeText={(value) =>
                                handleChange(value, 'name')
                            }
                            textAlign="center"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setDatePickerModalActive(true)}
                    >
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Birthdate"
                                placeholderTextColor={colours.selected}
                                value={formData.birthdate}
                                editable={false}
                                textAlign="center"
                                pointerEvents="none"
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect(
                            formData.ethnicity,
                            (value) => handleChange(value, 'ethnicity'),
                            ethnicities,
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect(
                            formData.birthplace,
                            (value) => handleChange(value, 'birthplace'),
                            countries,
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect(
                            formData.language,
                            (value) => handleChange(value, 'language'),
                            languages,
                        )}
                    </View>

                    <StyledButton
                        text="Next"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    />
                </View>
            </View>

            {datePickerModalActive && (
                <DatePickerModal
                    currentDate={formData.birthdate}
                    setDate={(value) => handleChange(value, 'birthdate')}
                    closeModal={() => setDatePickerModalActive(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colours.bg,
    },
    titleContainer: {
        flex: 0.1,
        marginTop: 20,
    },
    bodyContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fieldContainer: {
        flex: 1,
        paddingTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: colours.primaryText,
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: colours.secondary,
        borderRadius: 30,
        width: 250,
        height: 50,
        marginBottom: 10,
        // center
        justifyContent: 'center',
        // alignItems: "center",
    },
    input: {
        flex: 1,
        height: 40,
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        color: colours.primaryText,
    },
    pickerSelectStyles: {
        textAlign: 'center',
        marginTop: 4,
        // inputIOS: {
        //     color: colours.primaryText,
        //     textAlign: "center",
        //     marginTop: 13,
        // },
        // inputAndroid: {
        //     color: colours.primaryText,
        //     textAlign: "center",
        //     marginTop: 13,
        // }
    },
    pickerPlaceholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerPlaceholderText: {
        color: colours.primaryText,
    },
});

export default PatientRegistration;
