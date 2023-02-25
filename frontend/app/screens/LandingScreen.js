import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Image
} from 'react-native';

import colours from '../config/colours.js'; 

function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Project FUXI</Text>
            </View>
            <Image style={styles.image} source={require("../assets/fuxiIcon.png")} />
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Login")}
                underlayColor={colours.highlight}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Signup")}
                underlayColor={colours.highlight}
            >
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: colours.bg
    }, 
    titleContainer: 
    {
        borderBottomWidth: 4,
        borderBottomColor: colours.highlight, 
        marginBottom: 20, 
    }, 
    titleText: 
    {
        fontSize: 40, 
        color: colours.text, 
        paddingBottom: 20, 
        fontWeight: '500'
    }, 
    image: 
    {
        height: 100, 
        aspectRatio: 1, 
        marginBottom: 70
    }, 
    buttonContainer:
    {
        backgroundColor: colours.button,
        borderRadius: 10,
        width: 100, 
        height: 40, 
        display: 'flex', 
        alignItems: "center", 
        justifyContent: "center", 
    },
    buttonText:
    {
        color:colours.light,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10, 
        fontSize: 18, 
        fontWeight: '450'
    }
})

export default LandingScreen;