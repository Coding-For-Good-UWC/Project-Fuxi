import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
    Button,
    TouchableOpacity,
    Modal,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import DatePickerModal from "../components/DatePickerModal";
import BackButton from "../components/BackButton";

import colours from "../config/colours.js";

function PatientRegistration({ route, navigation }) {
    const [name, setName] = useState("");
    const [ethnicity, setEthnicity] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [language, setLanguage] = useState("");

    const [datePickerModalActive, setDatePickerModalActive] = useState(false);

    const [ethnicityModalVisible, setEthnicityModalVisible] = useState(false);
    const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
    const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Hindi", "Arabic", "Bengali", "Punjabi", "Urdu", "Indonesian", "Swahili", "Korean", "Dutch", "Turkish", "Thai", "Vietnamese", "Greek", "Hebrew", "Polish", "Romanian", "Hungarian", "Czech", "Swedish", "Danish", "Finnish", "Norwegian", "Slovak", "Croatian", "Serbian", "Bulgarian", "Slovenian", "Estonian", "Latvian", "Lithuanian", "Maltese", "Icelandic", "Albanian", "Macedonian", "Mongolian", "Uzbek", "Kazakh", "Azerbaijani", "Georgian", "Armenian", "Belarusian", "Ukrainian", "Tamil", "Telugu", "Marathi", "Kannada", "Gujarati", "Malayalam", "Odia", "Sinhala", "Afrikaans", "Zulu", "Xhosa", "Swazi", "Sotho", "Tswana", "Ndebele", "Shona", "Amharic", "Somali", "Tigrinya", "Oromo", "Burmese", "Khmer", "Lao", "Tibetan", "Bhutanese", "Malagasy", "Tongan", "Samoan", "Fijian", "Marshallese", "Palauan", "Kinyarwanda", "Kirundi", "Chewa", "Kinyamulenge", "Bemba", "Seychellois Creole", "Chichewa"];

    const ethnicityOptions = [
        "Singaporean",
        "Malaysian",
        "Indian",
        "Chinese",
        "Eurasian",
        "Hokkien",
    ];

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        // Check if username, password, name, age, ethnicity, birthdate, birthplace, or language are null
        if (
            !name ||
            !ethnicity ||
            !birthdate ||
            !birthplace ||
            !language
        ) {
            Alert.alert("Please fill in all fields.");
            return;
        }

        const birthDateObj = new Date(birthdate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
            age--;
        }

        const patientData = {
            name,
            age,
            birthdate,
            ethnicity,
            birthplace,
            language
        };

        navigation.navigate("PatientMusicForm", { ...patientData });
    };

    const onSelectEthnicity = (ethnicity) => {
        setEthnicity(ethnicity);
        console.log("SELECTED ETHNICITY " + ethnicity);
        setEthnicityModalVisible(false);
    };

    return (
        <View style={styles.container}>
          <BackButton navigation={navigation} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Patient</Text>
          </View>
          <Text></Text>
          <Text></Text>
          <View style={styles.bodyContainer}>
            <View style={styles.rightContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.dropdown}
                  placeholder="Name"
                  placeholderTextColor={colours.selected}
                  onChangeText={(name) => setName(name)}
                  textAlign="center"
                />
              </View>
    
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.dropdown}
                  placeholder="Birthdate"
                  placeholderTextColor={colours.selected}
                  value={birthdate}
                  editable={false}
                  textAlign="center"
                />
              </View>
              <Button
                title="Select Birthdate"
                color={colours.blue}
                onPress={() =>
                  setDatePickerModalActive(!datePickerModalActive)
                }
              />
              <Text></Text>
              <Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ethnicity"
                  placeholderTextColor={colours.selected}
                  value={ethnicity}
                  editable={false}
                  textAlign="center"
                />
              </View>
              <Button
                title="Select Ethnicity"
                color={colours.blue}
                onPress={() => setEthnicityModalVisible(true)}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={ethnicityModalVisible}
                onRequestClose={() => {
                  setEthnicityModalVisible(false);
                }}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Ethnicity</Text>
                    {ethnicityOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onSelectEthnicity(option)}
                      >
                        <Text style={styles.modalOption}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                    <Button
                      title="Close"
                      color={colours.blue}
                      onPress={() => setEthnicityModalVisible(false)}
                    />
                  </View>
                </View>
              </Modal>
              <Text></Text>
              <Text></Text>
    
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  placeholder={{ label: "Select Birthplace", value: null }}
                  onValueChange={(value) => setBirthplace(value)}
                  items={countries.map((country) => ({
                    label: country,
                    value: country,
                  }))}
                  style={{
                    inputAndroid: {
                      textAlign: "center",
                      marginTop:13
                    },
                    inputIOS: {
                      textAlign: "center",
                      marginTop:13
                    },
                  }}
                />
              </View>
    
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  placeholder={{ label: "Select Language", value: null }}
                  onValueChange={(value) => setLanguage(value)}
                  items={languages.map((lang) => ({
                    label: lang,
                    value: lang,
                  }))}
                  style={{
                    inputAndroid: {
                      textAlign: "center",
                      marginTop:13
                    },
                    inputIOS: {
                      textAlign: "center",
                      marginTop:13
                    },
                    placeholder:{

                        textAlign: 'center',
                        marginTop:13,
           
                    }
                  }}
                />
              </View>
    
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {datePickerModalActive && (
            <DatePickerModal
              currentDate={birthdate}
              setDate={setBirthdate}
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
        marginTop: 20, // Add marginTop
        //   marginBottom: 20, // Add marginBottom
      },
      bodyContainer: {
        flex: 0.55,
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
      dropdown: {
        alignItems: "center",
        marginTop:13
      },
      inputContainer: {
        backgroundColor: colours.secondary,
        borderRadius: 30,
        width: 200,
        height: 50,
        marginBottom: 20,
      },
      input: {
        flex: 1,
        height: 40,
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        color: colours.primaryText,
      },
      submitButton: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 100,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      },
      submitButtonText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      },
      modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        width: "80%",
      },
      modalTitle: {
        fontSize: 24,
        marginBottom: 15,
        fontWeight: "bold",
        color: colours.primaryText,
      },
      modalOption: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        color: colours.primaryText,
      },
    });
    
    export default PatientRegistration;