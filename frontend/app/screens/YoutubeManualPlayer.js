import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import BackButton from "../components/BackButton.js";

function YoutubeManual({ route, navigation }) {
  const { patient } = route.params;
  const [searchQuery, setQuery] = useState(""); // State for search text
  const [data, setData] = useState([]); // State for fetched data

  function searchYoutube() {
    const url = 'http://localhost:8080/track/scrapeyt';
    const postData = { searchQuery: searchQuery,patientInfo:patient};

    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
  })
      .then(response => response.json())
      .then(fetchedData => {
          setData(fetchedData.tracks);
          showAlert(fetchedData);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
    
    }
    function showAlert(fetchedData) {
      const options = fetchedData.tracks.map(item => ({
          text: `${item.name} By: ${item.artist.name}`,
          onPress: () => printSelected(item)
      }));
      options.push({ text: 'Cancel', style: 'cancel' });
  
      Alert.alert(
          'Select a video',
          '',
          options,
          { cancelable: true },
      );
  }
  
  function printSelected(item) {
      updateDB(item)
  }
  
  async function updateDB(item) {
    const requestPayload = {
      array: [
        { 
          item: item,
          rating: 3
        }
      ],
      patientInfo: patient
    };
  
    try {
      const response = await fetch(`http://localhost:8080/patient/manualyt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
  
      const data = await response.json();
      Alert.alert("Update Succesful");
    } catch (error) {
      Alert.alert("Update Unsuccesful, Please try again.");
      console.error(error); 
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Project Fuxi</Text>
        <BackButton navigation={navigation} />
        <Text style={styles.subhead}>Search for the Song you Want from Youtube</Text>
        {/* Search bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setQuery}
        />

        {/* Add button */}
        <TouchableOpacity style={styles.addButton} onPress={searchYoutube}>
          <Text style={styles.buttonText}>Add</Text>

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
  searchInput: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    height: "7%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    alignContent: "center",
  },
});

export default YoutubeManual;
