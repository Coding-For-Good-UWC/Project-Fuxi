import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Button
} from 'react-native';

import colours from '../config/colours.js'; 

function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Button 
                title="Login"
                onPress={() => navigation.navigate("Login")}/>
            <Button 
                title="Player"
                onPress={() => navigation.navigate("Player")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: "lightblue", 
    }, 
})



// const styles = StyleSheet.create({
//     container: 
//     {
//         flex: 1, 
//         flexDirection: 'row',
//         // alignItems: 'center', 
//         // justifyContent: 'center', 
//     },
//     left: 
//     {
//         flex: 1, 
//         // backgroundColor: "red", 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//     }, 
//     image: 
//     {
//         width: 100, 
//         height: 100, 
//     }, 
//     right: 
//     {
//         flex: 1.5, 
//         // backgroundColor: "orange", 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//     }, 
//     title: 
//     {
//         // fontFamily: 
//         fontSize: 30
//     },
// })

export default LandingScreen;