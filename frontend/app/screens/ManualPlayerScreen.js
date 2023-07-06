import React, { useState, useEffect, useContext } from "react";
import MyListComponent from "../components/MyListComponent.js";
import LoadingContext from "../store/LoadingContext.js";
import LoadingScreen from "../components/LoadingScreen.js";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StatusBar,
    Modal
} from "react-native";
import Slider from "@react-native-community/slider";
import {
    faPlay,
    faPause,
    faBackward,
    faForward,
    faRepeat,
    faThumbsDown
} from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import BackButton from "../components/BackButton.js";
import {getTrackTitles} from '../components/MyListComponent.js'
import Constants from 'expo-constants'

import colours from "../config/colours.js";
let x;


 function ManualPlayerScreen({ route, navigation }) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { patient } = route.params;
  const [titles, setTitles] = useState([]);
  async function updateDB(selectedTrackRatings, id) {
    const requestPayload = {
      array: selectedTrackRatings,
      patientID: id
    };
  
    try {
      const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/patient/manual`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
  
      const data = await response.json();
      console.log(data)
      if(data.message=="repeats"){
        console.log("REPEATED")
        console.log(data.existingValues)
        let trackNames = data.existingValues.map(item => item.name).join('\n');

        // display an alert
        Alert.alert(
          "Duplicate Tracks",
          "These tracks are already in the playlist: \n \n" + trackNames
        );

      }
      else{
        Alert.alert("Update Succesful");
      }

    } catch (error) {
      Alert.alert("Update Unsuccesful, Please try again.");
      console.error(error); 
    }
  }
  
  useEffect(() => {
    let trackids = patient.trackRatings.map((rating) => rating.track);
    setIsLoading(true)
    console.log(trackids)
    async function fetchTitles(ids) {
      const response = await fetch(
        `${Constants.expoConfig.extra.apiUrl}/track/titles?ids=${ids.join(",")}`
      );
      const data = await response.json();
      // console.log(data.titles)
      setIsLoading(false)
      return data.titles;
      
    }
    
    fetchTitles(trackids)
    .then((titles) => {
      let uniqueTitles = titles
        .filter((title, index, self) => {
          return (
            index ===
            self.findIndex((t) => t.Title === title.Title)
          );
        })
        .map((title) => ({
          ...title,
        }));
  
      setTitles(uniqueTitles);
    })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function SaveData() {
    let m = getTrackTitles();

    const selectedTrackRatings = [];

    m.forEach((item) => {
        selectedTrackRatings.push({
          id: item.id,
          rating: 3,
          name:item.title
        });
  
    });
  
    updateDB(selectedTrackRatings,patient._id);
  }
  

const handleSelectedIdsChange = (ids) => {
    setSelectedIds(ids);
  };

  const handleSelectedTitlesChange = (selectedtitles) => {
    setSelectedTitles(selectedTitles);
  };
function ViewSelectedTitles(){
    x = getTrackTitles();
    const titles = x.map(item => item.title);
    Alert.alert('Selected Playset', titles.join('\n \n'));
    
}

function goToYoutubeManualPlayer(){
  navigation.navigate("YoutubeManual",{patient});

}

const [modalVisible, setModalVisible] = useState(false);


const handleModalClose = () => {
  setModalVisible(false);
};

function goToPlayer(){
  navigation.navigate("ShuffleManual",{patient});
}
 
  return (
    
    <View style={styles.container}>
      <View style={styles.topContainer}>    
      <Text style={styles.title}>Project Fuxi</Text>
      <Text style={styles.subhead}> Select tracks for your Playset</Text>
      <BackButton navigation={navigation} />
      {titles.length > 0 && <MyListComponent data={titles} />}
      <Text></Text>
      <TouchableOpacity style={styles.button} onPress={ViewSelectedTitles}>
            <Text style={styles.buttonText}>View Selected Playset</Text>
        </TouchableOpacity>
    <Text></Text>
        <TouchableOpacity style={styles.buttonSave}onPress={SaveData} >
            <Text style={styles.buttonTextSave} >Save</Text>
        </TouchableOpacity>
        <Text></Text>
        <View style={styles.buttonContainer}>
          <Text></Text>
          <Text></Text>
        
  <TouchableOpacity style={styles.buttonPlay} onPress={goToYoutubeManualPlayer}>
    <Text style={styles.buttonTextsmall}>Search from Youtube</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.buttonPlay} onPress={goToPlayer}>
    <Text style={styles.buttonTextSave}>Play</Text>
  </TouchableOpacity>
</View>
      
      </View>
 
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    topContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginVertical: 10,
    },
    subhead: {
      fontSize: 18,
      marginVertical: 10,
    },
    button: {
      backgroundColor: colours.primary,
      padding: 10,
      borderRadius: 5,
      width: '40%',
      height: '7%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 12,
      alignContent:"center"
    },
    buttonSave: {
      backgroundColor: colours.primary,
      padding: 10,
      borderRadius: 5,
      width: '40%',
      height: '7%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',  // Use this if you want some space between the buttons
      width: '100%',  // Use this to stretch the container across the screen width
      paddingHorizontal: 40,  // Use this to give some horizontal padding
    },
    buttonPlay: {
      backgroundColor: colours.genreTV,
      padding: 10,
      borderRadius: 5,
      flex: 1,  // Use this to make the buttons take up equal space in the container
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical:13,
      marginHorizontal: 5,  // Use this to give some horizontal margin
    },
    buttonTextSave: {
      color: "#FFFFFF",
      fontSize: 15,
      alignContent:"center"
    },
    buttonTextsmall:{

      color: "#FFFFFF",
      fontSize: 12,
      alignContent:"center",
      textAlign:'center'
    }
  });
  
export default ManualPlayerScreen;