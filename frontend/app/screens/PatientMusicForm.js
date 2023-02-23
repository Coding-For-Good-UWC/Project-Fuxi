// import React, { useState } from "react";
// import 
// {
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     TextInput,
//     Button,
//     TouchableOpacity, 
//     Platform
// } from "react-native";

// import GenreToggleButton from '../components/GenreToggleButton'; 

// import colours from '../config/colours.js'; 

// function PatientMusicForm ({ route, navigation }) 
// {
//   const { username, password, name, age, ethnicity, birthdate, birthplace, language } = route.params;

//   const genres = ["Cantonese", "Chinese", "Christian", "English", "Hainanese", "Hindi", "Hokkien", "Malay", "Mandarin", "TV", "Tamil"]; // TODO: force to pick at least 3
//   const [preferredGenres, setPreferredGenres] = useState(Array(genres.length).fill(false)); 

//   const updatePreferences = (genreIndex) => 
//   {
//     let newPreferredGenres = preferredGenres; 
//     preferredGenres[genreIndex] = !preferredGenres[genreIndex]; 
//     setPreferredGenres(newPreferredGenres); 
//     console.log (preferredGenres); 
//   }

  // const submitHandler = async (evt) => 
  // {
  //   evt.preventDefault(); 

  //   const genreData = Object.assign(...genres.map((k, i) => ({[k]: preferredGenres[i]}))); // construct object

  //   // Get list of genres by filtering out the false values
  //   const selectedGenres = Object.keys(genreData).filter((key) => genreData[key]);

  //   const newPatientData =
  //   {
  //     username,
  //     password,
  //     name, 
  //     age, 
  //     ethnicity, 
  //     birthdate, 
  //     birthplace, 
  //     language, 
  //     genres: selectedGenres
  //   }

  //   const response = await fetch ("http://localhost:8080/patient/signup", 
  //   { 
  //     body: JSON.stringify (newPatientData), 
  //     headers: { "Content-Type": "application/json" }, 
  //     method: "POST"
  //     // credentials: "include"
  //   }); 
  //   const data = await response.json(); 

  //   if (data.status === 'ERROR')
  //     console.log(data.message);
  //   else
  //   {
  //     console.log ("Patient created"); 
  //     console.log (">>>>>>>>>>>>>")
  //     console.log (data.newPatient); 
  //     console.log (data.newPatient._id)
  //     navigation.navigate ("Player"); 
  //   }
  // }

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>New Patient</Text>
//         </View>
//         <View style={styles.bodyContainer}>
//           {/* TODO: back button */}
//           <View style={styles.rightContainer}>
//               {genres.map((genre, index) => <GenreToggleButton genre={genre} key={index} updatePreferences={() => updatePreferences(index)} />)}

//             <TouchableOpacity>
//               <Button
//                 style={styles.loginButton}
//                 onPress={submitHandler}
//                 color={colours.blue}
//                 title="Submit"
//               />
//             </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create
// ({
//   container: 
//   {
//     flex: 1, 
//     alignItems: "center", 
//     justifyContent: "center", 
//     backgroundColor: colours.bg, 
//     paddingLeft: "40%", 
//     paddingRight: "40%", 
//     paddingTop: "10%", 
//     paddingBottom: "10%", 
//   }, 
//   card: 
//   {
//     flex: 1, 
//     alignItems: "center", 
//     justifyContent: "center", 
//     backgroundColor: colours.charcoal, 
//     // width: "100%", 
//     width: 600, 
//     height: "100%",
//     borderRadius: 15, 
//     shadowColor: 'black',
//     shadowOffset: { width: 10, height: 15 },
//     shadowRadius: 5,
//     shadowOpacity: 0.3, 
//     flexDirection: 'column', 
//     paddingLeft: "20%", 
//     paddingRight: "20%", 
//     paddingTop: "5%", 
//     paddingBottom: "5%", 
//   }, 
//   titleContainer: 
//   {
//     flex: 0.1
//   }, 
//   bodyContainer: 
//   {
//     flex: 1, 
//     flexDirection: 'row', 
//     width: "100%", 
//     height: "100%",
//   }, 
//   // leftContainer: 
//   // {
//   //   flex: 1, 
//   //   justifyContent: 'center', 
//   //   alignItems: 'center', 
//   //   // backgroundColor: 'red'
//   // }, 
//   rightContainer: 
//   {
//     flex: 1.2, 
//     paddingTop: "5%", 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     // backgroundColor: 'blue'
//   }, 
//   title: 
//   {
//     color: colours.text, 
//     fontSize: 45, 
//     fontWeight: 'bold', 
//     marginTop: 40
//   }, 
//   loginText: 
//   {
//     color: colours.text, 
//     fontSize: 30, 
//     fontWeight: 'bold', 
//     marginBottom: 20
//   }, 
//   // image: 
//   // {
//   //   // height: 100, 
//   //   // aspectRatio: 1, 
//   //   width: "100%", 
//   //   aspectRatio: 1, 
//   // }, 
//   inputContainer: 
//   {
//     backgroundColor: colours.blue,
//     borderRadius: 30,
//     // width: Platform.OS === 'web' ? "30%" : "70%",
//     width: 200, 
//     height: 50,
//     marginBottom: 20,
//   },
//   input: 
//   {
//     flex: 1,
//     height: 50,
//     padding: 10,
//     marginLeft: 20,
//     marginRight: 20,
//     color: colours.text
//   },
//   clickableText: {
//       height: 30,
//       color: colours.blue
//   },
//   // loginButton: {
//   //     width: "80%",
//   //     borderRadius: 25,
//   //     height: 50,
//   //     alignItems: "center",
//   //     justifyContent: "center",
//   //     marginTop: 40,
//   //     backgroundColor: "#FF1493",
//   // }
// });

// export default PatientMusicForm;


















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

function PatientMusicForm ({ route, navigation }) 
{
    const { username, password, name, age, ethnicity, birthdate, birthplace, language } = route.params;

    const genres = ["Cantonese", "Chinese", "Christian", "English", "Hainanese", "Hindi", "Hokkien", "Malay", "Mandarin", "TV", "Tamil"]; // TODO: force to pick at least 3
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

      // Get list of genres by filtering out the false values
      const selectedGenres = Object.keys(genreData).filter((key) => genreData[key]);

      const newPatientData =
      {
        username,
        password,
        name, 
        age, 
        ethnicity, 
        birthdate, 
        birthplace, 
        language, 
        genres: selectedGenres
      }

      const response = await fetch ("http://localhost:8080/patient/signup", 
      { 
        body: JSON.stringify (newPatientData), 
        headers: { "Content-Type": "application/json" }, 
        method: "POST"
        // credentials: "include"
      }); 
      const data = await response.json(); 

      if (data.status === 'ERROR')
        console.log(data.message);
      else
      {
        console.log ("Patient created"); 
        console.log (">>>>>>>>>>>>>")
        console.log (data.newPatient); 
        console.log (data.newPatient._id)
        navigation.navigate ("Player"); 
      }
    }

    return (
      <View style={styles.container}>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Genres</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.info}>Please select the genre(s) for your patient</Text>
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
    );
}

const styles = StyleSheet.create
({
  container: 
  {
    flex: 2, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: colours.bg, 
    // paddingLeft: "40%", 
    // paddingRight: "40%", 
    paddingTop: "10%", 
    paddingBottom: "10%", 
  }, 
  // card: 
  // {
  //   flex: 1, 
  //   alignItems: "center", 
  //   justifyContent: "center", 
  //   backgroundColor: colours.charcoal, 
  //   // width: "100%", 
  //   width: 600, 
  //   height: "100%",
  //   borderRadius: 15, 
  //   shadowColor: 'black',
  //   shadowOffset: { width: 10, height: 15 },
  //   shadowRadius: 5,
  //   shadowOpacity: 0.3, 
  //   flexDirection: 'column', 
  //   paddingLeft: "20%", 
  //   paddingRight: "20%", 
  //   paddingTop: "5%", 
  //   paddingBottom: "5%", 
  // }, 
  titleContainer: 
  {
    flex: 0.5,
  }, 
  bodyContainer: 
  {
    flex: 2, 
    flexDirection: 'column', 
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

  info: {
    fontSize:"18%"

  },
  rightContainer: 
  {
    flex: 1.9, 
    paddingTop: "5%", 
    alignItems: 'center', 
    justifyContent: 'center', 
    // backgroundColor: 'blue'
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: '340', 
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