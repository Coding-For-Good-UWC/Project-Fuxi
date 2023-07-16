import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView,Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colours from "../config/colours.js";
import Constants from "expo-constants";
let accvals;


const updateTitles = (selectedTitles) =>{
    accvals = selectedTitles;
    
}



const MyListComponent = ({ data, patientId }) => {

  const getPlayset = async () => {
    const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/patient/getmanual?id=${patientId}`);
    const data = await response.json();
    return data
}
const [currentPlayset, setCurrentPlayset] = useState([]);

useEffect(() => {
  getPlayset().then(playset => {
    setCurrentPlayset(playset);
    const initialSelectedTitles = playset.map(item => ({ id: item.id, title: item.Title }));
    setSelectedTitles(initialSelectedTitles);
  });
}, []);

  
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedTitles, setSelectedTitles] = useState([]);

    async function updateDB(selectedTrackRatings) {
      const requestPayload = {
          array: selectedTrackRatings,
          patientID: patientId,
      };

      try {
          const response = await fetch(
              `${Constants.expoConfig.extra.apiUrl}/patient/manual`,
              {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(requestPayload),
              }
          );

          const data = await response.json();
          console.log(data);
          if (data.message == "repeats") {
              console.log("REPEATED");
              console.log(data.existingValues);
              let trackNames = data.existingValues
                  .map((item) => item.Title)
                  .join("\n");

              // display an alert
              Alert.alert(
                  "Duplicate Tracks",
                  "These tracks are already in the playlist: \n \n" +
                      trackNames
              );
          } 
      } catch (error) {
          Alert.alert("Update Unsuccesful, Please try again.");
          console.error(error);
      }
  }




  async function deletefromDB(uri) {
    const requestPayload = {
        trackid: uri,
        patientid: patientId,
    };

    try {
        const response = await fetch(
            `${Constants.expoConfig.extra.apiUrl}/patient/deletemanual`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestPayload),
            }
        );

        const data = await response.text()
        console.log(data);
    } catch (error) {
        Alert.alert("Update Unsuccesful, Please try again.");
        console.error(error);
    }
}

  
    const filteredData = data.filter(item => {
      if (!item || !item.Title) {
        return false;
      }
      return (item.Title.toLowerCase()).includes(searchText.toLowerCase());
    });
    const handleSelectTitle = (id, title, uri) => {
      setSelectedTitles((prevSelectedTitles) => {
        if (prevSelectedTitles.some((item) => item.id === uri)) {
          console.log(`Item deselected: ${title}`);
          deletefromDB(uri);
          setCurrentPlayset((prevCurrentPlayset) => prevCurrentPlayset.filter((item) => item.id !== uri));
          return prevSelectedTitles.filter((item) => item.id !== uri);
        } else {
          console.log(`Item selected: ${title}`);
          const valuetoUpdate = []
          valuetoUpdate.push({
            id: uri,
            rating: 3,
            name: title,
          });
          updateDB(valuetoUpdate); // Call updateDB when item is selected
          return [...prevSelectedTitles, { id: uri, title: title }];
        }
      });
    };
    
    
    const renderItem = ({ item }) => {
      const isSelected = selectedTitles.some((selectedItem) => selectedItem.id === item.YtId) || currentPlayset.some((playsetItem) => playsetItem.id === item.YtId);
    
      return (
        <>
          <TouchableOpacity onPress={() => {
            handleSelectTitle(item.YtId, item.Title, item.YtId);
          }} key={'touchable-' + item._id}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: 16,
              borderRadius: 10,
              marginVertical: 8,
              borderColor: '#0000FF',
              borderWidth: 1,
              backgroundColor: isSelected ? '#CCCCCC' : '#FFFFFF',
            }} key={'view-' + item._id}>
              <Text style={{ color: '#333333' }}>{item.Title}</Text>
            </View>
          </TouchableOpacity>
          <View key={'separator1-' + item._id.toString()} style={{ height: 1, backgroundColor: '#CCCCCC' }} />
          <View key={'separator2-' + item._id.toString()} style={{ height: 1, backgroundColor: '#CCCCCC' }} />
        </>
      );
    };
    
    updateTitles(selectedTitles)
    
    return (
      <View>
      <View style={{ 
  borderRadius: 10, 
  backgroundColor: '#FFFFFF', 
  padding: 12, 
  height: 350,
  width: '90%',
  borderColor:'black',
  borderWidth:1,
  overflow: 'hidden',
}}>
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8
  }}>
    <MaterialIcons name="search" size={24} color="black" style={{ marginRight: 8 }} />
    <TextInput
      placeholder="Search"
      value={searchText}
      onChangeText={text => setSearchText(text)}
      style={{ flex: 1 }}
    />
  </View>
  <View style={{ height: 300, width:290}}>
  <FlatList
    data={filteredData}
    keyExtractor={item => item._id.toString()}
    renderItem={renderItem}
    extraData={selectedTitles}
  />
</View>

</View>

      <View>
      </View>
      </View>
    );
  };
  
  export default MyListComponent;