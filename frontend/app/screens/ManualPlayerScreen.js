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
      const response = await fetch(`http://localhost:8080/patient/manual`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
  
      const data = await response.json();
      console.log(data); //  successful update!
      Alert.alert("Update Succesful");
    } catch (error) {
      Alert.alert("Update Unsuccesful, Please try again.");
      console.error(error); 
    }
  }
  
  useEffect(() => {
    console.log("ratings"+patient.trackRatings)
    let trackids = patient.trackRatings.map((rating) => rating.track);
    setIsLoading(true)
    
    async function fetchTitles(ids) {
      // console.log("DIS"+ids)
      const response = await fetch(
        `http://localhost:8080/track/titles?ids=${ids.join(",")}`
      );
      const data = await response.json();
      setIsLoading(false)
      return data.titles;
      
    }
console.log("RATINGS"+patient.trackRatings)
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
    console.log("ma"+m)
    const selectedTrackRatings = [];
  
    m.forEach((item) => {

        selectedTrackRatings.push({
          id: item.id,
          rating: 3,
        });
  
    });
  
    // console.log("Selected Track Ratings:", selectedTrackRatings);
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
  navigation.navigate("Player",{patient});
}
 
  console.log("PATIENT ID"+patient._id);
  return (
    
    <View style={styles.container}>
      <View style={styles.topContainer}>    
      <Text style={styles.title}>Project Fuxi</Text>
      <Text style={styles.subhead}> Current Playset</Text>
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
        <TouchableOpacity style={styles.buttonPlay}onPress={goToYoutubeManualPlayer} >
            <Text style={styles.buttonTextsmall} >Search from Youtube</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text></Text>
        <TouchableOpacity style={styles.buttonPlay}onPress={goToPlayer} >
            <Text style={styles.buttonTextSave} >Play</Text>
        </TouchableOpacity>
      
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
    buttonPlay: {
      backgroundColor: colours.genreTV,
      padding: 10,
      borderRadius: 5,
      width: '30%',
      height: '7%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonTextSave: {
      color: "#FFFFFF",
      fontSize: 15,
      alignContent:"center"
    },
    buttonTextsmall:{

      color: "#FFFFFF",
      fontSize: 12,
      alignContent:"center"
    }
  });
  
export default ManualPlayerScreen;