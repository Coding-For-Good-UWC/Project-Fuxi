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

import colours from '../config/colours.js'; 

function PatientRegistration ({ navigation }) 
{
    return (
      <View style={styles.container}>
        <View style={styles.card}>
            <Text>REGISTER PATIENT</Text>
          {/* <View style={styles.titleContainer}>
            <Text style={styles.title}>Caregiver Dashboard</Text>
          </View>
          <View style={styles.bodyContainer}>
            { DUMMY_PATIENT_DATA.map ((patientData, index) => <DashboardPatientItem data={patientData} key={index} />)}
          </View>
            <Button 
                style={styles.newPatientButton}
                title="New Patient" 
                color={colours.blue}
                onPress={() => navigation.navigate("PatientRegistration")}
            /> */}
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
    position: 'absolute', 
    top: 0
  }
});

export default PatientRegistration;