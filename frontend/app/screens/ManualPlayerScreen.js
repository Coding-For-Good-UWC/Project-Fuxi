import React, { useState, useEffect, useContext } from "react";
import MyListComponent from "../components/MyListComponent.js";
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
import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";
import {getTrackTitles} from '../components/MyListComponent.js'
import Constants from 'expo-constants'

import colours from "../config/colours.js";
let x;


 function ManualPlayerScreen({ route, navigation }) {
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
      console.log(data); // Handle successful update
    } catch (error) {
      console.error(error); // Handle error
    }
  }
  
  useEffect(() => {x
    let trackids = patient.trackRatings.map((rating) => rating.track);
    // console.log(patient.trackRatings);
    // console.log("trackids", trackids);

    async function fetchTitles(ids) {
      const response = await fetch(
        `${Constants.expoConfig.extra.apiUrl}/track/titles?ids=${ids.join(",")}`
      );
      const data = await response.json();

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
      const matchingRating = patient.trackRatings.find((rating) => rating.track === item.id);
  
      if (matchingRating) {
        selectedTrackRatings.push({
          id: item.id,
          rating: matchingRating.rating,
        });
      }
    });
  
    console.log("Selected Track Ratings:", selectedTrackRatings);
    updateDB(selectedTrackRatings,patient._id);
  }
  

const handleSelectedIdsChange = (ids) => {
    setSelectedIds(ids);
    // console.log('Selected IDs:', ids);
  };

  const handleSelectedTitlesChange = (selectedtitles) => {
    setSelectedTitles(selectedTitles);
    // console.log('Selected IDs:', selectedtitles);
  };
function ViewSelectedTitles(){
    x = getTrackTitles();
    // console.log(x);
    const titles = x.map(item => item.title);
    Alert.alert('Selected Playset', titles.join('\n \n'));
    
}

const [modalVisible, setModalVisible] = useState(false);


const handleModalClose = () => {
  setModalVisible(false);
};
  // console.log("PRINTING TITLES TO GO "+titles)
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
    buttonTextSave: {
      color: "#FFFFFF",
      fontSize: 15,
      alignContent:"center"
    }
  });
  
export default ManualPlayerScreen;