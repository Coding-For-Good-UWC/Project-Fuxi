import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePickerModal from '../components/DatePickerModal';
import colours from '../config/colours.js';
import StyledButton from '../components/StyledButton';

const PatientRegistration = ({ route, navigation }) => {
    const countries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
    const languages = [ "English", "Chinese", "Hindi", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Arabic", "Bengali", "Punjabi", "Urdu", "Indonesian", "Swahili", "Korean", "Dutch", "Turkish", "Thai", "Vietnamese", "Greek", "Hebrew", "Polish", "Romanian", "Hungarian", "Czech", "Swedish", "Danish", "Finnish", "Norwegian", "Slovak", "Croatian", "Serbian", "Bulgarian", "Slovenian", "Estonian", "Latvian", "Lithuanian", "Maltese", "Icelandic", "Albanian", "Macedonian", "Mongolian", "Uzbek", "Kazakh", "Azerbaijani", "Georgian", "Armenian", "Belarusian", "Ukrainian", "Tamil", "Telugu", "Marathi", "Kannada", "Gujarati", "Malayalam", "Odia", "Sinhala", "Afrikaans", "Zulu", "Xhosa", "Swazi", "Sotho", "Tswana", "Ndebele", "Shona", "Amharic", "Somali", "Tigrinya", "Oromo", "Burmese", "Khmer", "Lao", "Tibetan", "Bhutanese", "Malagasy", "Tongan", "Samoan", "Fijian", "Marshallese", "Palauan", "Kinyarwanda", "Kirundi", "Chewa", "Kinyamulenge", "Bemba", "Seychellois Creole", "Chichewa"];
    const ethnicities = [ "Singaporean", "Malaysian", "Indian", "Chinese", "Eurasian", "Hokkien"];
    const [ethnicityQuery, setEthnicityQuery] = useState('');
const [birthplaceQuery, setBirthplaceQuery] = useState('');
const [languageQuery, setLanguageQuery] = useState('');
const [filteredEthnicities, setFilteredEthnicities] = useState(ethnicities);
const [filteredBirthplaces, setFilteredBirthplaces] = useState(countries);
const [filteredLanguages, setFilteredLanguages] = useState(languages);


    const [formData, setFormData] = useState({
        name: '',
        ethnicity: '',
        birthdate: '',
        birthplace: '',
        language: '',
    });
    const [datePickerModalActive, setDatePickerModalActive] = useState(false);

    const handleChange = (value, name) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    
        if (value) {
            if (name === 'ethnicity') {
                setEthnicityQuery(value);
                const filtered = ethnicities.filter(item =>
                    item.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredEthnicities(filtered);
            } else if (name === 'birthplace') {
                setBirthplaceQuery(value);
                const filtered = countries.filter(item =>
                    item.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredBirthplaces(filtered);
            } else if (name === 'language') {
                setLanguageQuery(value);
                const filtered = languages.filter(item =>
                    item.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredLanguages(filtered);
            }
        }
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
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
            age--;
        }

        const patientData = { name, age, birthdate, ethnicity, birthplace, language };
        navigation.navigate('PatientMusicForm', { ...patientData });
    };

    const renderPickerSelect = (placeholder, onValueChange, items) => (
        <RNPickerSelect
            placeholder={{ label: placeholder, value: null }}
            onValueChange={onValueChange}
            items={items.map(item => ({ label: item, value: item }))}
            style={styles.pickerSelectStyles}
            textAlign="center"
        />
    )

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>New Listener</Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.rightContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor={colours.selected}
                            onChangeText={(value) => handleChange(value, 'name')}
                            textAlign="center"
                        />
                    </View>

                    <TouchableOpacity onPress={() => setDatePickerModalActive(true)}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Birthdate"
                                placeholderTextColor={colours.selected}
                                value={formData.birthdate}
                                editable={false}
                                textAlign="center"
                                pointerEvents='none'
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect("Select Ethnicity", (value) => handleChange(value, 'ethnicity'), ethnicities)}
                    </View>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect("Select Birthplace", (value) => handleChange(value, 'birthplace'), countries)}
                    </View>

                    <View style={styles.inputContainer}>
                        {renderPickerSelect("Select Language", (value) => handleChange(value, 'language'), languages)}
                    </View>
                    <StyledButton text="Next" onPress={handleSubmit} style={styles.submitButton} />
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.bg,
    },
    titleContainer: {
        flex: 0.1,
        marginTop: 20,
    },
    bodyContainer: {
        flex: 0.45,
        flexDirection: "row",
        width: "100%",
        height: "100%",
    },
    rightContainer: {
        flex: 1,
        paddingTop: "5%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: colours.primaryText,
        fontSize: 36,
        fontWeight: "bold",
    },
    inputContainer: {
        backgroundColor: colours.secondary,
        borderRadius: "100%",
        width: 250,
        height: 50,
        marginBottom: 10,
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
        inputAndroid: {
            textAlign: "center",
            marginTop: 13,
        },
        inputIOS: {
            textAlign: "center",
            marginTop: 13,
        }
    }
});

export default PatientRegistration;