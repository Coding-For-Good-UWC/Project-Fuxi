import React, { useState } from "react";
import 
{
    StyleSheet,
    Text,
    TouchableOpacity, 
    View,
  } from "react-native";

import colours from '../config/colours.js'; 

function MusicToggleButton(props)
{
    const [bgColour, setBgColour] = useState(colours.blue); 

    const toggleSelected = () => 
    {
        setBgColour (bgColour === colours.blue ? colours.selected : colours.blue); 
        props.updatePreferences(); 
    }

    return (
        <TouchableOpacity onPress={toggleSelected}>
            <View style={[styles.container, {backgroundColor: bgColour}]}>
                <Text>{props.genre}</Text>
            </View>
        </TouchableOpacity>
    ); 
}

const styles = StyleSheet.create
({
    container: 
    {
        width: 140, 
        height: 40, 
        marginBottom: 10, 
        // flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    }
}); 

export default MusicToggleButton; 
