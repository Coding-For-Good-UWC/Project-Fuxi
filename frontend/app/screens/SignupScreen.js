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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import LoadingContext from "../store/LoadingContext.js";
import Constants from 'expo-constants'

import colours from "../config/colours.js";
import StyledButton from "../components/StyledButton.js";

function SignupScreen({ navigation }) 
{
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const { setIsLoading } = useContext(LoadingContext);

    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;

    let handleSignUp = async (evt) => {
        evt.preventDefault();

        // Check if user has entered all fields
        if (!name || !email || !password || !confirmedPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

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
        let userCredential; 
        const auth = getAuth();
		try {
			userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
		} catch (error) {
			console.log(error);
			Alert.alert("Error", error.message);
			setIsLoading(false);
			return;
		}

        const user = userCredential.user;
        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/signup`, {
            body: JSON.stringify({ uid: user.uid, email: user.email, name }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        const data = await response.json();

        if (data.status === "ERROR") {
            Alert.alert("Error", data.message);
            setIsLoading(false);
            return;
        }

        const idToken = await auth.currentUser.getIdToken();

        const response2 = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", token: idToken },
        });
        const data2 = await response2.json();
        setIsLoading(false);
        navigation.navigate("Dashboard");
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
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

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.clickableText}>Log in to an existing account</Text>
            </TouchableOpacity>
            <StyledButton text="Signup" onPress={handleSignUp} />
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
        marginBottom: 30,
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
});

export default SignupScreen;
