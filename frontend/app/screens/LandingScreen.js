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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.bg,
    },
    titleContainer: {
        borderBottomWidth: 2,
        borderBottomColor: colours.primary,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 32,
        color: colours.primaryText,
        paddingBottom: 20,
        fontWeight: "500",
    },
    image: {
        height: 100,
        aspectRatio: 1,
        marginBottom: 70,
    },
    buttonContainer: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 120,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
});

export default LandingScreen;