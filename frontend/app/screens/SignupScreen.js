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
import emailjs from '@emailjs/browser'
import colours from "../config/colours.js";
import StyledButton from "../components/StyledButton.js";
import prompt from 'react-native-prompt-android';
import Constants from 'expo-constants';
function SignupScreen({ navigation }) 
{
    let pass;
    let userpassword;
    
    function generateRandomPassword(){
        var chars = "0123456789";
        var passwordLength = 5;
        pass = "";
    
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            pass += chars.substring(randomNumber, randomNumber +1);
        }
    
        console.log("actual password:" + pass);
        return pass;
    }

    function SendEmail(name, email, pass){
        var params = {
            to_name: name,
            to_email: email,
            password: pass
        };

        // emailjs.send(Constants.expoConfig.extra.serviceacc,Constants.expoConfig.extra.templateid,params,Constants.expoConfig.extra.publicapikey);
    }
    
    function Verifyemail(){
        if(String(userpassword) == String(pass)){
            return true
        } else {
            console.log("wrong password");
            return false;
        }
    }
    
    async function showAlert(name, email) {
        let passwordCorrect = false;
        let isCancelled = false;
      
        while (!passwordCorrect && !isCancelled) {
          userpassword = await new Promise((resolve) => {
            prompt(
              "Email Verification",
              "We've just sent you a verification email with a password. Please enter your password here to proceed!",
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    setIsLoading(false);
                    isCancelled = true;
                    resolve(null); // Resolve with null when Cancel is clicked
                  },
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: (inputPassword) => {
                    if (/^\d{6}$/.test(inputPassword)) {
                      resolve(inputPassword);
                    } else {
                      Alert.alert(
                        "Invalid Password",
                        "Please enter 6 digits only.",
                        [{ text: "OK", onPress: () => resolve(null) }]
                      );
                    }
                  },
                },
                {
                  text: 'Resend Email',
                  onPress: () => {
                    SendEmail(name, email, generateRandomPassword());
                    resolve(null);
                  },
                },
              ],
              {
                type: 'secure-text',
                cancelable: false,
                defaultValue: '',
                placeholder: 'password',
              }
            );
          });
      
          if (userpassword !== null && !isCancelled) {
            if (Verifyemail()) {
              console.log("email verified");
              passwordCorrect = true;
            } else {
              console.log("no");
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
      
    
    
    
    async function ValidateEmail(name, email) {
        console.log("in validate email");
        pass = generateRandomPassword();
        SendEmail(name, email, pass);
    
        try {
            if(await showAlert(name, email)==true){
                console.log("verified!!!")
                return true;
            } else {
                return false;
            }
    
        } catch (error) {
            console.log("Error occurred:", error);
            // Handle the error as needed
        }
    }

      
      
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
    
        if (!passwordRegex.test(password)) {
            Alert.alert(
                "Error",
                "Password must have at least 8 characters and include a digit"
            );
            return;
        }
    
       
    
        if(await ValidateEmail(name,email)==true){
            const getnames = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/namerepeat?name=${encodeURIComponent(name)}`, {
                method: "GET",
            });
            const values = await getnames.json();
            
            if (values.message === "same") {
                Alert.alert("Error", "Institute with the same name already exists, please choose a different name and try again.");
                setIsLoading(false);
                console.log("EXISTS")
                return
            }
            
            setIsLoading(true);
            let userCredential; 
            const auth = getAuth();
            try {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert(
                        "Error",
                        "Email is already in use. Please login instead.",
                        [
                            {
                                text: "Go to Login",
                                onPress: () => navigation.navigate("Login")
                            }
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
                const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/signup`, {
                    body: JSON.stringify({ uid: user.uid, email: user.email, name }),
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                });
                const data = await response.json();
           
                const idToken = await auth.currentUser.getIdToken();
                const response2 = await fetch(`${Constants.expoConfig.extra.apiUrl}/institute/verify`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", token: idToken },
                });
                const data2 = await response2.json();
              
                setIsLoading(false);
                navigation.navigate("Dashboard");
               
              } catch (error) {
                console.log(error);
                  Alert.alert("Error", "An error occurred while processing your request");
        
                setIsLoading(false);
              }
              
              
        } 
       
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
                    onChangeText={(confirmedPassword) =>setConfirmedPassword(confirmedPassword)}
                    autoCorrect={false}
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
