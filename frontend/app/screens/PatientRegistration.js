import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Modal,
} from "react-native";

import DatePickerModal from "../components/DatePickerModal";
import BackButton from "../components/BackButton";

import colours from "../config/colours.js";

function PatientRegistration({ route, navigation }) {
    const { username, password } = route.params;

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [ethnicity, setEthnicity] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [language, setLanguage] = useState("");

    const [datePickerModalActive, setDatePickerModalActive] = useState(false);

    const [ethnicityModalVisible, setEthnicityModalVisible] = useState(false);

    const ethnicityOptions = [
        "Singaporean",
        "Malaysian",
        "Indian",
        "Chinese",
        "Eurasian",
        "Hokkien",
    ];

    const handleLogin = async (evt) => {
        evt.preventDefault();

        const patientData = {
            username,
            password,
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
        };

        navigation.navigate("PatientMusicForm", { ...patientData });
    };

    const validateNumInput = (text) => {
        let digitsOnly = "";
        const digits = "0123456789";

        for (let i = 0; i < text.length; i++) {
            if (digits.indexOf(text[i]) > -1) {
                digitsOnly = digitsOnly + text[i];
            }
        }

        return digitsOnly;
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
            <View style={styles.bodyContainer}>
                <View style={styles.rightContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor={colours.selected}
                            onChangeText={(name) => setName(name)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            placeholderTextColor={colours.selected}
                            value={age}
                            onChangeText={(age) =>
                                setAge(validateNumInput(age))
                            }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Birthdate"
                            placeholderTextColor={colours.selected}
                            value={birthdate}
                            editable={false}
                            onChangeText={(age) =>
                                setAge(validateNumInput(age))
                            }
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
                                <Text style={styles.modalTitle}>
                                    Select Ethnicity
                                </Text>
                                {ethnicityOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() =>
                                            onSelectEthnicity(option)
                                        }
                                    >
                                        <Text style={styles.modalOption}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <Button
                                    title="Close"
                                    color={colours.blue}
                                    onPress={() =>
                                        setEthnicityModalVisible(false)
                                    }
                                />
                            </View>
                        </View>
                    </Modal>
                    <Text></Text>
                    <Text></Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Birthplace"
                            placeholderTextColor={colours.selected}
                            onChangeText={(birthplace) =>
                                setBirthplace(birthplace)
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Language"
                            placeholderTextColor={colours.selected}
                            onChangeText={(language) => setLanguage(language)}
                        />
                    </View>

                    <TouchableOpacity>
                        <Button
                            style={styles.RegisterButton}
                            onPress={handleLogin}
                            color={colours.blue}
                            title="Register"
                        />
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
      marginBottom: 20, // Add marginBottom
  },
  bodyContainer: {
      flex: 0.8,
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
      borderRadius: 30,
      width: 200,
      height: 50,
      marginBottom: 20,
  },
  input: {
      flex: 1,
      height: 50,
      padding: 10,
      marginLeft: 20,
      marginRight: 20,
      color: colours.primaryText,
  },
  RegisterButton: {
      width: "80%",
      padding: "10%",
      borderRadius: 0,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: colours.primary,
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