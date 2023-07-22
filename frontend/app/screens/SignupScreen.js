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

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import emailjs from "@emailjs/browser";
import prompt from "react-native-prompt-android";

import colours from "../config/colours.js";
import StyledButton from "../components/StyledButton.js";

import LoadingContext from "../store/LoadingContext.js";
import Constants from "expo-constants";

function SignupScreen({ navigation }) 
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const { setIsLoading } = useContext(LoadingContext);

    let verificationCode = ""; // global variable to store the verification code
    let inputVerificationCode = ""; // what verification code the user inputs

    const generateRandomPassword = () => 
    {
        const chars = "0123456789";
        const passwordLength = 5;
        verificationCode = "";

        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            verificationCode += chars.substring(randomNumber, randomNumber + 1);
        }

        console.log("Verification Code: " + verificationCode);

        return verificationCode;
    }

    const SendEmail = (name, email, pass) => 
    {
        var params = {
            to_name: name,
            to_email: email,
            password: pass,
        };

        emailjs.send(
            Constants.expoConfig.extra.serviceacc,
            Constants.expoConfig.extra.templateid,
            params,
            Constants.expoConfig.extra.publicapikey
        );
    }

    const verifyCode = () => 
    {
        if (inputVerificationCode == verificationCode)
            return true;
        else {
            Alert.alert("Invalid code", "Wrong code entered. Please try again!");
            return false;
        }
    }

    async function showAlert(name, email) 
    {
        let passwordCorrect = false;
        let isCancelled = false;

        while (!passwordCorrect && !isCancelled) 
        {
            inputVerificationCode = await new Promise((resolve) => 
            {
                prompt(
                    "Email Verification",
                    "We've just sent you a verification email with a code. Please enter your code here to proceed!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => {
                                setIsLoading(false);
                                isCancelled = true;
                                resolve(null); // Resolve with null when Cancel is clicked
                            },
                            style: "cancel",
                        },
                        {
                            text: "OK",
                            onPress: (inputPassword) => {
                                if (inputPassword === "") {
                                    Alert.alert(
                                        "Invalid Password",
                                        "Please enter a password!"
                                    );
                                    resolve(null);
                                }
                                else
                                    resolve(inputPassword);
                            },
                        },
                        {
                            text: "Resend email",
                            onPress: () => {
                                SendEmail(
                                    name,
                                    email,
                                    generateRandomPassword()
                                );
                                resolve(null);
                            },
                        },
                    ],
                    {
                        cancelable: false,
                        defaultValue: "",
                        placeholder: "password",
                    }
                );
            });

            if (inputVerificationCode !== null && !isCancelled) {
                if (verifyCode()) {
                    console.log("Email verified!");
                    passwordCorrect = true;
                } else {
                    console.log("Email not verified!");
                    await new Promise((resolve) => {
                        Alert.alert(
                            "Invalid Password",
                            "Wrong password entered. Please try again!",
                            [{ text: "OK", onPress: resolve }]
                        );
                    });
                }
            }
        }

        return !isCancelled; // Return true if not cancelled, false otherwise
    }

    const validateEmail = async (name, email) => 
    {
        console.log("In validate email");
        verificationCode = generateRandomPassword();
        SendEmail(name, email, verificationCode);

        try {
            if ((await showAlert(name, email)) == true) {
                console.log("Verified!!!");
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("An error occurred:", error);
        }
    }

    let handleSignUp = async (evt) => {
        evt.preventDefault();
        // Check if user has entered all fields
        if (!name || !email || !password || !confirmedPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        // Check if the entered email is in the right format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Invalid email format");
            return;
        }

        if (password !== confirmedPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        // if ((await validateEmail(name, email)) == true) {
        const getnames = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/institute/namerepeat?name=${name}`);
        const values = await getnames.json();

        if (values.message === "same") {
            Alert.alert(
                "Error",
                "Institute with the same name already exists, please choose a different name and try again."
            );
            setIsLoading(false);
            console.log("EXISTS");
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
            if (error.code === "auth/email-already-in-use") {
                Alert.alert(
                    "Error",
                    "Email is already in use. Please login instead.",
                    [
                        {
                            text: "Go to Login",
                            onPress: () => navigation.navigate("Login"),
                        },
                    ]
                );
            } else {
                Alert.alert("Error", error.message);
            }
            setIsLoading(false);
            return;
        }

        try {
            const user = userCredential.user;
            const response = await fetch(
                `https://project-fuxi-fsugt.ondigitalocean.app/institute/signup`,
                {
                    body: JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        name,
                    }),
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                }
            );
            const data = await response.json();

            const idToken = await auth.currentUser.getIdToken();
            const response2 = await fetch(
                `https://project-fuxi-fsugt.ondigitalocean.app/institute/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: idToken,
                    },
                }
            );
            const data2 = await response2.json();

            setIsLoading(false);
            navigation.navigate("Dashboard");
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "An error occurred while processing your request"
            );

            setIsLoading(false);
        }
        // }
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
                    autoCorrect={false}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    secureTextEntry={false}
                    onChangeText={(email) => setEmail(email)}
                    autoCorrect={false}
                    type="email"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    autoCorrect={false}
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
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.clickableText}>
                    Log in to an existing account
                </Text>
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
