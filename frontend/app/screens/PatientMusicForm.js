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

import GenreToggleButton from '../components/GenreToggleButton'; 

import colours from '../config/colours.js'; 

function PatientMusicForm ({ navigation }) 
{
    const genres = ["Pop", "Hip-hop", "Rap", "Classical", "Jazz"]; // TODO: force to pick at least 3
    const [preferredGenres, setPreferredGenres] = useState(Array(6).fill(false)); 

    const updatePreferences = (genreIndex) => 
    {
        let newPreferredGenres = preferredGenres; 
        preferredGenres[genreIndex] = !preferredGenres[genreIndex]; 
        setPreferredGenres(newPreferredGenres); 
        console.log (preferredGenres); 
    }

    const submitHandler = async (evt) => 
    {
        evt.preventDefault(); 

        const genreData = Object.assign(...genres.map((k, i) => ({[k]: preferredGenres[i]}))); // construct object

        console.log (genreData); 

        // TODO: post to db

			// let result = await fetch ('http://localhost:8080/v1/user/login', 
      // {
			// 	method: 'POST',
			// 	// credentials: 'include',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(
			// 		{
			// 			"username": username,
			// 			"password": password
			// 		}
			// 	)
			// }).then(res => res.json())

			// if (result.status !== 'ok')
			// 	console.log(result.error_message); 
			// else
      // {
      //   console.log ("SUCCESS"); 
      //   navigation.navigate("Dashboard"); 
      // }
    }

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Patient</Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.rightContainer}>
                {genres.map((genre, index) => <GenreToggleButton genre={genre} key={index} updatePreferences={() => updatePreferences(index)} />)}

              <TouchableOpacity>
                <Button
                  style={styles.loginButton}
                  onPress={submitHandler}
                  color={colours.blue}
                  title="Submit"
                />
              </TouchableOpacity>
              </View>
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
    paddingLeft: "40%", 
    paddingRight: "40%", 
    paddingTop: "10%", 
    paddingBottom: "10%", 
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
    shadowRadius: 5,
    shadowOpacity: 0.3, 
    flexDirection: 'column', 
    paddingLeft: "20%", 
    paddingRight: "20%", 
    paddingTop: "5%", 
    paddingBottom: "5%", 
  }, 
  titleContainer: 
  {
    flex: 0.1
  }, 
  bodyContainer: 
  {
    flex: 1, 
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
    flex: 1.2, 
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
    marginTop: 40
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
    backgroundColor: colours.blue,
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
    color: colours.text
  },
  clickableText: {
      height: 30,
      color: colours.blue
  },
  // loginButton: {
  //     width: "80%",
  //     borderRadius: 25,
  //     height: 50,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     marginTop: 40,
  //     backgroundColor: "#FF1493",
  // }
});

export default PatientMusicForm;