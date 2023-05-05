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
    const { institute } = route.params;

    const [name, setName] = useState("");
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
            alert("Please fill in all fields.");
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
            language,
            institute
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
                            placeholder="Birthdate"
                            placeholderTextColor={colours.selected}
                            value={birthdate}
                            editable={false}
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