import React, { useState } from "react";
import 
{
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity, 
    Platform
  } from "react-native";

import DashboardPatientItem from "../components/DashboardPatientItem.js";

import colours from '../config/colours.js'; 

const DUMMY_PATIENT_DATA = [
  {
    id: '1', 
    name: 'Patient 1', 
    location: 'SG', 
    birthdate: '2000-00-00', 
    ethnicity: 'Hokkien', 
    language: 'English', 
    gender: 'Male', 
  }, 
  {
    id: '2', 
    name: 'Patient 2', 
    location: 'SG', 
    birthdate: '2001-00-00', 
    ethnicity: 'Hokkien', 
    language: 'Chinese', 
    gender: 'Female', 
  }, 
  {
    id: '3', 
    name: 'Patient 3', 
    location: 'SG', 
    birthdate: '2002-02-10', 
    ethnicity: 'Indian', 
    language: 'English', 
    gender: 'Male', 
  }, 
  {
    id: '4', 
    name: 'Patient 4', 
    location: 'SG', 
    birthdate: '1988-10-05', 
    ethnicity: 'Chinese', 
    language: 'Chinese', 
    gender: 'Female', 
  }, 
  {
    id: '5', 
    name: 'Patient 5', 
    location: 'SG', 
    birthdate: '1968-01-01', 
    ethnicity: 'Malay', 
    language: 'English', 
    gender: 'Male', 
  }, 
  {
    id: '6', 
    name: 'Patient 6', 
    location: 'SG', 
    birthdate: '1978-02-01', 
    ethnicity: 'Malay', 
    language: 'English', 
    gender: 'Female', 
  }, 
];

function CaregiverDashboard ({ navigation }) 
{
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Caregiver Dashboard</Text>
          </View>
          <View style={styles.bodyContainer}>
            { DUMMY_PATIENT_DATA.map ((patientData, index) => <DashboardPatientItem data={patientData} key={index} />)}
          </View>
        <View style={styles.newPatientButton}>
        <Button // TODO: POSITION TOP RIGHT (position absolute not working)
            title="New Patient" 
            color={colours.blue}
            onPress={() => navigation.navigate("PatientRegistration")}
        />
        </View>
        </View>
      </View> 
    );
}

const styles = StyleSheet.create
({
  container: 
  {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: colours.bg, 
    paddingLeft: "6%", 
    paddingRight: "6%", 
    paddingTop: "6%", 
    paddingBottom: "6%", 
  }, 
  card: 
  {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: colours.charcoal, 
    width: "100%", 
    height: "100%",
    borderRadius: 15, 
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 15 },
    shadowRadius: 5,
    shadowOpacity: 0.3, 
    flexDirection: 'column', 
    paddingLeft: "10%", 
    paddingRight: "10%", 
    paddingTop: "5%", 
    paddingBottom: "5%", 
  }, 
  titleContainer: 
  {
    flex: 0.2, 
  }, 
  bodyContainer: 
  {
    flex: 1, 
    width: "100%", 
    height: "100%",
    flexDirection: "row", 
    flexWrap: "wrap", 
    // backgroundColor: 'blue', 
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: 'bold', 
  }, 

  newPatientButton: 
  {
    marginTop: 50
  }
});

export default CaregiverDashboard;