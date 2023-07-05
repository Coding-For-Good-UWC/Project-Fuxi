import React, { useState, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";
import colours from "../config/colours.js";
import PatientItem from "../components/PatientItem.js";

import { getPatients } from  '../api/patients'; 
import { getInstitute } from "../api/institutes";

function PatientDashboard({ route, navigation }) 
{
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [patientData, setPatientData] = useState();
    const [institute, setInstitute] = useState({email: ""}); 

   useFocusEffect(
        React.useCallback(() => {
            const loadPatients = async () => {
                setIsLoading(true);

                const institute = await getInstitute();

                setInstitute (institute);

                const patients = await getPatients(); 

                setPatientData(patients);

                setIsLoading(false);
            };

            loadPatients();
        }, [])
    );

    const selectPatient = (patientId) => {
        const patient = patientData.find((patient) => patient._id === patientId);

        navigation.navigate("PrePlayer", { patient });
    };

    const addPatient = () => 
    {
        navigation.navigate("PatientRegistration");
    }

    if (isLoading)
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
            
    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Dashboard</Text>
                <Text style={styles.subtitleText}>{institute.name}</Text>
            </View>
            <ScrollView style={styles.patientList}>
                {patientData && patientData.map((patient) => (
                    <TouchableOpacity
                        key={patient._id}
                        onPress={() => selectPatient(patient._id)}
                    >
                        <PatientItem patient={patient} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
                style={styles.newButton}
                onPress={addPatient}
            >
                <Text style={styles.newText}>Add Patient</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
        alignItems: "center",
    },
    titleContainer: {
        paddingTop: 100,
        borderBottomWidth: 2,
        borderBottomColor: colours.primary,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 32,
        color: colours.primaryText,
        paddingBottom: 10,
        fontWeight: "500",
    },
    subtitleText: {
        fontSize: 24,
        color: colours.primaryText,
        paddingBottom: 10,
        fontWeight: "500",
    },
    patientList: {
        width: "100%",
        paddingHorizontal: 30,
        flexGrow: 1,
    },
    newButton: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 130,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    newText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
});

export default PatientDashboard;
