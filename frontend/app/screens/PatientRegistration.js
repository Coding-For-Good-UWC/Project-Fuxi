import React, { useState } from "react";
import 
{
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity
} from "react-native";

import DatePickerModal from '../components/DatePickerModal'; 

import { SelectList } from 'react-native-dropdown-select-list'; 

import colours from '../config/colours.js'; 

function PatientRegistration ({ route, navigation }) 
{
    const { username, password } = route.params;

    const [name, setName] = useState(""); 
    const [age, setAge] = useState(0); 
    const [ethnicity, setEthnicity] = useState(""); 
    const [birthdate, setBirthdate] = useState(""); 
    const [birthplace, setBirthplace] = useState(""); 
    const [language, setLanguage] = useState(""); 

    const [datePickerModalActive, setDatePickerModalActive] = useState(false); 

    // const [selectedLanguage, setSelectedLanguage] = useState();

    const ethnicityOptions = ["Singaporean", "Malaysian", "Indian", "Chinese", "Eurasian", "Hokkien"]; 

    const handleLogin = async (evt) => 
    {
			evt.preventDefault(); 

      const patientData = 
      {
        username,
        password,
        name, 
        age, 
        ethnicity, 
        birthdate, 
        birthplace, 
        language
      }

      navigation.navigate ("PatientMusicForm", { ...patientData }); 
		}

    const validateNumInput = (text) => 
    {
      let digitsOnly = ""; 
      const digits = "0123456789"; 

      for (let i = 0; i < text.length; i++) 
      {
        if(digits.indexOf(text[i]) > -1 ) 
        {
          digitsOnly = digitsOnly + text[i]; 
        }
      }

      return digitsOnly; 
    }

    return (
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Patient</Text>
          </View>
          <View style={styles.bodyContainer}>
            {/* <View style={styles.leftContainer}>
              <Image style={styles.image} source={require("../assets/fuxiIcon.png")} />
            </View> */}
            <View style={styles.rightContainer}>
              <View
                style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor= {colours.selected}
                  // autoCapitalize="words"
                  onChangeText={(name) => setName(name)}
                />
              </View>

              <View
                style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor= {colours.selected}
                  value={age}
                  onChangeText={(age) => setAge(validateNumInput(age))}
                />
              </View>

              <View
                style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Birthdate"
                  placeholderTextColor= {colours.selected}
                  value={birthdate}
                  editable={false}
                  onChangeText={(age) => setAge(validateNumInput(age))}
                />
              </View>
              <Button 
                title="Select Birthdate"
                color={colours.blue}
                onPress={() => setDatePickerModalActive(!datePickerModalActive)}
              />
            <Text></Text>
            <View style ={styles.overlay}>
            <SelectList 
                  setSelected={(ethnicity) => setEthnicity(ethnicity)} 
                  data={ethnicityOptions} 
                  placeholder="Select Ethnicity"
                />
            </View>
           
             <Text></Text>
             <Text></Text>
              <View
                style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Birthplace"
                  placeholderTextColor= {colours.selected}
                  // autoCapitalize="words"
                  onChangeText={(birthplace) => setBirthplace(birthplace)}
                />
              </View>

              <View
                style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Language"
                  placeholderTextColor= {colours.selected}
                  // autoCapitalize="words"
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

          {datePickerModalActive && <DatePickerModal currentDate={birthdate} setDate={setBirthdate} closeModal={() => setDatePickerModalActive(false)} />}
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
    // paddingLeft: "40%", 
    // paddingRight: "40%", 
    paddingTop: "5%", 
    paddingBottom: "2%", 
    //  position:"relative"
  }, 
  card: 
  {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: colours.charcoal, 
    // width: "100%", 
    width: 600, 
    height: "100%",
    borderRadius: 15, 
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 15 },
    shadowRadius: 2,
    shadowOpacity: 0.2, 
    flexDirection: 'column', 
    // paddingLeft: "20%", 
    // paddingRight: "20%", 
    paddingTop: "5%", 
    paddingBottom: "5%", 
  }, 
  titleContainer: 
  {
    flex: 0.1
  }, 
  bodyContainer: 
  {
    flex: 0.8, 
    flexDirection: 'row', 
    width: "100%", 
    height: "100%",
  }, 
  // leftContainer: 
  // {
  //   flex: 1, 
  //   justifyContent: 'center', 
  //   alignItems: 'center', 
  //   // backgroundColor: 'red'
  // }, 
  rightContainer: 
  {
    flex: 1, 
    paddingTop: "5%", 
    alignItems: 'center', 
    justifyContent: 'center', 
    // backgroundColor: 'blue'
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: 'bold', 
    // marginTop: 40
  }, 
  loginText: 
  {
    color: colours.text, 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 20
  }, 
  // image: 
  // {
  //   // height: 100, 
  //   // aspectRatio: 1, 
  //   width: "100%", 
  //   aspectRatio: 1, 
  // }, 
  inputContainer: 
  {
    backgroundColor: colours.charcoal,
    borderRadius: 30,
    // width: Platform.OS === 'web' ? "30%" : "70%",
    width: 200, 
    height: 50,
    marginBottom: 20,

  },
  input: 
  {
    flex: 1,
    height: 50,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    color: colours.blue,
  },
  clickableText: {
      height: 30,
      color: colours.blue
  },
  RegisterButton: {
      width: "80%",
      padding:"10%",
      borderRadius: 0,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FF1493",
  },
  overlay:{
    // position:"absolute"
  }
});

export default PatientRegistration;