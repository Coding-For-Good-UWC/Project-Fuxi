import React, { useState, useEffect, useContext } from "react";
import MyListComponent from "../components/MyListComponent.js";
import LoadingContext from "../store/LoadingContext.js";

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { getTrackTitles } from "../components/MyListComponent.js";
import Constants from "expo-constants";

import colours from "../config/colours.js";
let x;


function ManualPlayerScreen({ route, navigation }) {
    const { setIsLoading } = useContext(LoadingContext);
    const { patient } = route.params;
    const [titles, setTitles] = useState([]);
   
    useEffect(() => {
        let trackids = patient.trackRatings.map((rating) => rating.track);
        setIsLoading(true);
        console.log(trackids);
        async function fetchTitles(ids) {
            const response = await fetch(
                `${
                    Constants.expoConfig.extra.apiUrl
                }/track/titles?ids=${ids.join(",")}`
            );
            const data = await response.json();
            // console.log(data.titles)
            setIsLoading(false);
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
    const getPlayset = async () => {
        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/patient/getmanual?id=${patient._id}`);
        const data = await response.json();
        return data
    }

    async function viewTitles(){
        try {
          const response = await fetch(
            `${Constants.expoConfig.extra.apiUrl}/patient/getmanual?id=${patient._id}`
          );
          const songNames = await response.json();
          const songNamesString = songNames.map((item, index) => `${index + 1}. ${item.name}`).join("\n \n");
      
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
    


    function goToYoutubeManualPlayer() {
        navigation.navigate("YoutubeManual", { patient });
    }

    const [modalVisible, setModalVisible] = useState(false);

    const handleModalClose = () => {
        setModalVisible(false);
    };

   async function goToPlayer() {
        const x = await getPlayset(); // await the result of getPlayset
        console.log("playset" + x);
        if (x.length < 5) {
          Alert.alert("Please add more songs before playing! You have less than 5 songs in the playset currently");
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
                {titles.length > 0 && <MyListComponent data={titles} patientId={patient._id} />}
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
                    <Text></Text>
                    <Text></Text>

                    <TouchableOpacity
                        style={styles.buttonPlay}
                        onPress={goToYoutubeManualPlayer}
                    >
                        <Text style={styles.buttonTextsmall}>
                            Search from Youtube
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
