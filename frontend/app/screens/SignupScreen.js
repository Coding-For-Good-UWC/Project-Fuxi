import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import LoadingContext from "../store/LoadingContext.js";
import Constants from 'expo-constants'

import colours from "../config/colours.js";
import BackButton from "../components/BackButton.js";

function SignupScreen({ navigation }) 
{
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;

    let handleSignUp = async (evt) => {
        evt.preventDefault();

        if (password !== confirmedPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (!passwordRegex.test(password)) {
            Alert.alert(
                "Error",
                "Password must have at least 8 characters and include a digit"
            );
            return;
        }

        setIsLoading(true);

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;
        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/signup`, {
            body: JSON.stringify({ uid: user.uid, email: user.email, name }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        const data = await response.json();
        // console.log ("CREATED INSTITUTE:")
        // console.log (data);

        const idToken = await auth.currentUser.getIdToken();

        const response2 = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", token: idToken },
        });
        const data2 = await response2.json();
        // console.log ("VERIFIED INSTITUTE:")
        // console.log (data2);

        setIsLoading(false);
        navigation.navigate("Dashboard");
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Project FUXI</Text>
                <Text style={styles.titleText}>Signup</Text>
            </View>
            <Image
                style={styles.image}
                source={require("../assets/fuxiIcon.png")}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    autoCapitalize="none"
                    secureTextEntry={false}
                    onChangeText={(name) => setName(name)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    secureTextEntry={false}
                    onChangeText={(email) => setEmail(email)}
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

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(confirmedPassword) =>
                        setConfirmedPassword(confirmedPassword)
                    }
                />
            </View>

            <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.clickableText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.clickableText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleSignUp}
                underlayColor={colours.highlight}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
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

export default SignupScreen;
