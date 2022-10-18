import React, { useState } from "react";
import 
{
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity, 
    Platform
  } from "react-native";

import colours from '../config/colours.js'; 

function LoginScreen ({ navigation }) 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let handleLogin = async (evt) => 
    {
			evt.preventDefault(); 

			let result = await fetch ('http://localhost:8080/v1/user/login', 
      {
				method: 'POST',
				// credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					{
						"username": username,
						"password": password
					}
				)
			}).then(res => res.json())

			if (result.status !== 'ok')
				console.log(result.error_message); 
			else
        console.log ("SUCCESS"); 
		}
   
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Project FUXI</Text>
        <Image style={styles.image} source={require("../assets/fuxiIcon.png")} />
        <View
          style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            secureTextEntry={false}
            onChangeText={(username) => setUsername(username)}
          />
        </View>
   
        <View
          style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity><Text style={styles.clickableText}>Sign Up</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.clickableText}>Forgot Password?</Text></TouchableOpacity>
        <TouchableOpacity>
          <Button
            style={styles.loginButton}
            onPress={handleLogin}
            title="LOGIN"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            style={styles.loginButton}
            onPress={() => navigation.navigate("Player")}
            title="PLAYER"
          />
        </TouchableOpacity>
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
    backgroundColor: colours.bg
  }, 
  title: 
  {
    fontSize: 35, 
    color: colours.text, 
    marginBottom: 20
  }, 
  image: 
  {
    height: 100, 
    aspectRatio: 1, 
    marginBottom: 20
  }, 
  inputContainer: 
  {
    backgroundColor: colours.navbar,
    borderRadius: 30,
    width: Platform.OS === 'web' ? "30%" : "70%",
    height: 50,
    marginBottom: 20,
  },
  input: 
  {
    flex: 1,
    height: 50,
    padding: 10,
    marginLeft: 20,
  },
  clickableText: {
      height: 30,
  },
  loginButton: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FF1493",
  }
});

export default LoginScreen;