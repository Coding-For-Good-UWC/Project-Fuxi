import React from "react";
import 
{
    StyleSheet,
    Text,
    View,
    Image,
  } from "react-native";

import colours from '../config/colours.js'; 

function DashboardPatientItem (props) 
{
    const { name, age, ethnicity } = props.data; 

    console.log ("PROPS")
    console.log(props.data)
    console.log(typeof(props.data))
    console.log (name)
    console.log (age)
    console.log (ethnicity)

    return (
      <View style={styles.container}>
        <View style={styles.card}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{name}</Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>{"Age: " + age}</Text>
                    <Text style={styles.infoText}>{"Ethnicity: " + ethnicity}</Text>
                </View>
            </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create
({
    container: 
    {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        // backgroundColor: colours.bg, 
        // width: "20%", 
        // width: 900, 
        flexBasis: '30%', 
        height: 200, 
        marginLeft: 10, 
        marginRight: 10, 
        marginBottom: 10, 
        borderRadius: 5
    }, 
    card: 
    {
        flex: 1, 
        // alignItems: "center", 
        // justifyContent: "center", 
        backgroundColor: colours.grey, 
        // backgroundColor: colours.charcoal, 
        width: "100%", 
        height: "100%",
        borderRadius: 15, 
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.1, 
        paddingLeft: "10%", 
        paddingRight: "10%", 
        paddingTop: "5%", 
        paddingBottom: "5%", 
        flexDirection: 'column', 
    }, 

    nameContainer: 
    {
        flex: 0.2, 
        // backgroundColor: 'red', 
    }, 
    bodyContainer: 
    {
        flex: 1, 
        // backgroundColor: 'green', 
        flexDirection: 'row', 
    }, 

    // imageContainer: 
    // {
    //     flex: 1, 
    //     // backgroundColor: 'blue', 
    //     justifyContent: 'center', // vertically center

    // }, 
    infoContainer: 
    {
        flex: 1.5, 
        // backgroundColor: 'orange', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 5
    }, 

    nameText: 
    {
        color: colours.text, 
        fontSize: 20, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginTop: 8, 
    }, 
    
    profileImage: 
    {
        width: "100%", 
        height: "70%", 
    },  
    
    infoText: 
    {
        color: colours.text, 
        fontSize: 15, 
        textAlign: 'center'
    }, 
});

export default DashboardPatientItem;