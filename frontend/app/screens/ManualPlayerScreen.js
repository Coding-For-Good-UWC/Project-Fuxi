import React, { useState, useEffect, useContext, useCallback } from "react";
import MyListComponent from "../components/MyListComponent.js";
import LoadingContext from "../store/LoadingContext.js";
import { useFocusEffect } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import Constants from "expo-constants";

import colours from "../config/colours.js";

function ManualPlayerScreen({ route, navigation }) {
    const { setIsLoading } = useContext(LoadingContext);
    const { patient } = route.params;
    const [titles, setTitles] = useState([]);
    
    const updateSelectionPanel = async () => {
        let trackids = patient.trackRatings.map((rating) => rating.track);
        async function fetchTitles(ids) {
            setIsLoading(true);
            const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/titles?ids=${ids.join(",")}`);
            const data = await response.json();
            setIsLoading(false);
            return data.titles;
        }
    
        fetchTitles(trackids)
            .then((titles) => {
                let uniqueTitles = titles
                    .filter((title) => title && (
                        titles.findIndex((t) => t && t.Title === title.Title) === titles.indexOf(title)
                    ))
                    .map((title) => ({ ...title }));
                setTitles(uniqueTitles);
            })
            .catch((error) => {
                console.error(error);
            });
    
        console.log(">>>>>>>>>>>>>>>>> UPDATE SELECTION PANEL <<<<<<<<<<<<<<<<<<<<");
    };    

    useFocusEffect(
        useCallback(() => {
            updateSelectionPanel();
        }, [patient])
    );

    const getPlayset = async () => {
        const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/patient/getmanual?id=${patient._id}`);
        const data = await response.json();
        return data
    }

    async function viewTitles(){
        try {
          const response = await fetch(
            `https://project-fuxi-fsugt.ondigitalocean.app/patient/getmanual?id=${patient._id}`
          );
          const songNames = await response.json();
          console.log("getmanual"+songNames)
          const songNamesString = songNames.map((item, index) => `${index + 1}. ${item.Title}`).join("\n \n");
      
          // Show the alert
          if(songNamesString==""){
            Alert.alert("Playset is currently empty!")

          }
          else{
            Alert.alert(
                "Current Playset",
                songNamesString,
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
              );
            }

          }
        
        catch(error){
          console.log(error)
        }
    }

   async function goToPlayer() {
        const x = await getPlayset(); // await the result of getPlayset
        console.log("playset" + x);
        if (x.length < 1) {
          Alert.alert("You have not added any songs to your playset yet!");
        }
        else {
          navigation.navigate("ShuffleManual", { patient });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Project Fuxi</Text>
                <Text style={styles.subhead}>
                    {" "}
                    Select tracks for your Playset
                </Text>
                {titles && titles.length > 0 && <MyListComponent data={titles} patientId={patient._id} />}
                <Text></Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={viewTitles}
                >
                    <Text style={styles.buttonText}>View Selected Playset</Text>
                </TouchableOpacity>
                <Text></Text>
                <Text></Text>
                <View style={styles.buttonContainer}>
                    {/* <Text></Text>
                    <Text></Text> */}

                    <TouchableOpacity
                        style={styles.buttonPlay}
                        onPress={() => navigation.navigate("YoutubeManual", { patient })}
                    >
                        <Text style={styles.buttonTextsmall}>
                            Custom Song Search
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonPlay}
                        onPress={goToPlayer}
                    >
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
    buttonSave: {
        backgroundColor: colours.primary,
        padding: 10,
        borderRadius: 5,
        width: "40%",
        height: "7%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between", 
        width: "100%", 
        paddingHorizontal: 40, 
    },
    buttonPlay: {
        backgroundColor: colours.genreTV,
        padding: 10,
        borderRadius: 5,
        flex: 1, 
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 13,
        marginHorizontal: 5, 
    },
    buttonTextSave: {
        color: "#FFFFFF",
        fontSize: 15,
        alignContent: "center",
    },
    buttonTextsmall: {
        color: "#FFFFFF",
        fontSize: 12,
        alignContent: "center",
        textAlign: "center",
    },
});

export default ManualPlayerScreen;
