import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions
} from "react-native";
import StyledButton from "../components/StyledButton.js";
import colours from "../config/colours.js";

function LandingScreen({ navigation }) 
{
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Project FUXI</Text>
            </View>
            <Image
                style={styles.image}
                source={require("../assets/fuxiIcon.png")}
            />
            <StyledButton text="Login" onPress={() => navigation.navigate("Login")} />
            <StyledButton text="Signup" onPress={() => navigation.navigate("Signup")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
        alignItems: "center",
        justifyContent: "center",
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
    }
});

export default LandingScreen;
