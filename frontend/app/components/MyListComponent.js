import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colours from "../config/colours.js";
let accvals;
export function getTrackTitles(){
    // console.log("in gettracktitles"+accvals)
    console.log("IN GETTRACKTITLES"+accvals)
    return(accvals)

}
const updateTitles = (selectedTitles) =>{
    accvals = selectedTitles;
    
}

const MyListComponent = ({ data }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedTitles, setSelectedTitles] = useState([]);
    console.log("DATA"+data[0].Title);

    const filteredData = data.filter(item => {
      if (!item || !item.Title) {
        console.log("Missing Title: ", item);
        return false;
      }
      return (item.Title.toLowerCase()).includes(searchText.toLowerCase());
    });
    
    const handleSelectTitle = (id, title) => {
      setSelectedTitles((prevSelectedTitles) => {
        if (prevSelectedTitles.some((item) => item.id === id)) {
          return prevSelectedTitles.filter((item) => item.id !== id);
        } else {
          return [...prevSelectedTitles, { id: id, title: title }];
        }
      });
    };
    
    const renderItem = ({ item }) => {
      const isSelected = selectedTitles.some((selectedItem) => selectedItem.id === item._id);
    
      return (
          <>
           <TouchableOpacity onPress={() => {
        handleSelectTitle(item._id, item.Title);
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
    <View key={'separator1-' + item._id.toString()} style={{height: 1, backgroundColor: '#CCCCCC'}} />
    <View key={'separator2-' + item._id.toString()} style={{height: 1, backgroundColor: '#CCCCCC'}} />
          </>
        );
    };
    
    
    // console.log(selectedTitles);
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
  <FlatList
    data={filteredData}
    keyExtractor={item => item._id.toString()}
    renderItem={renderItem}
    extraData={selectedTitles}
    style={{ flex: 1 }} 
  />
</View>

      <View>
      </View>
      </View>
    );
  };
  
  export default MyListComponent;
  