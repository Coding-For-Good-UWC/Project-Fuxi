import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
} from "react-native";

import colours from "../config/colours.js";
import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";

function LoginScreen({ navigation }) {
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let handleLogin = async (evt) => {
        evt.preventDefault();

        setIsLoading(true);

        const response = await fetch(
            "http://localhost:8080/patient/login", // get students for selected teacher's class
            {
                body: JSON.stringify({ username, password }), // send over text representation of json object
                headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
                method: "POST",
            }
        );
        const data = await response.json();

        if (data.status === "ERROR") 
        {
            console.log(data.message);
            setIsLoading(false); 
        }
        else {
            console.log("LOG IN SUCCESSFUL");
            const patient = data.patient;
            setIsLoading(false);
            navigation.navigate("Player", { patient });
        }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Project FUXI</Text>
                <Text style={styles.titleText}>Login</Text>
            </View>
            <Image
                style={styles.image}
                source={require("../assets/fuxiIcon.png")}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    autoCapitalize="none"
                    secureTextEntry={false}
                    onChangeText={(username) => setUsername(username)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity>
                <Text style={styles.clickableText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.clickableText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleLogin}
                underlayColor={colours.highlight}
            >
                <Text style={styles.buttonText}>Login</Text>
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
        paddingBottom: 10,
        fontWeight: "500",
    },
    image: {
        height: 100,
        aspectRatio: 1,
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: colours.secondary,
        borderRadius: 30,
        width: Platform.OS === "web" ? "30%" : "70%",
        height: 50,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        padding: 10,
        marginLeft: 20,
        color: colours.primaryText,
    },
    clickableText: {
        height: 30,
        color: colours.primary,
        textDecorationLine: "underline",
        marginBottom: 10,
    },
    buttonContainer: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 100,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

export default LoginScreen;
