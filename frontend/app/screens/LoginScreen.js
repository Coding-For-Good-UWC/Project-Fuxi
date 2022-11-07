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
      {
        console.log ("SUCCESS"); 
        navigation.navigate("Player"); 
      }
		}
   
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Project FUXI</Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.leftContainer}>
              <Image style={styles.image} source={require("../assets/fuxiIcon.png")} />
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.loginText}>LOGIN</Text>
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
                  color={colours.blue}
                  title="LOGIN"
                />
              </TouchableOpacity>
              </View>
            </View>
          </View>
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
    backgroundColor: colours.bg, 
    paddingLeft: "20%", 
    paddingRight: "20%", 
    paddingTop: "10%", 
    paddingBottom: "10%", 
  }, 
  card: 
  {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: colours.charcoal, 
    width: "100%", 
    height: "100%",
    borderRadius: 15, 
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 15 },
    shadowRadius: 5,
    shadowOpacity: 0.3, 
    flexDirection: 'column', 
    paddingLeft: "20%", 
    paddingRight: "20%", 
    paddingTop: "5%", 
    paddingBottom: "5%", 
  }, 
  titleContainer: 
  {
    flex: 0.1
  }, 
  bodyContainer: 
  {
    flex: 1, 
    flexDirection: 'row', 
    width: "100%", 
    height: "100%",
  }, 
  leftContainer: 
  {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    // backgroundColor: 'red'
  }, 
  rightContainer: 
  {
    flex: 1.2, 
    paddingTop: "5%", 
    alignItems: 'center', 
    justifyContent: 'center', 
    // backgroundColor: 'blue'
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: 'bold', 
  }, 
  loginText: 
  {
    color: colours.text, 
    fontSize: 35, 
    fontWeight: 'bold', 
    marginBottom: 20
  }, 
  image: 
  {
    // height: 100, 
    // aspectRatio: 1, 
    width: "100%", 
    aspectRatio: 1, 
  }, 
  inputContainer: 
  {
    backgroundColor: colours.blue,
    borderRadius: 30,
    // width: Platform.OS === 'web' ? "30%" : "70%",
    width: 200, 
    height: 50,
    marginBottom: 20,
  },
  input: 
  {
    flex: 1,
    height: 50,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    color: colours.text
  },
  clickableText: {
      height: 30,
      color: colours.blue
  },
  // loginButton: {
  //     width: "80%",
  //     borderRadius: 25,
  //     height: 50,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     marginTop: 40,
  //     backgroundColor: "#FF1493",
  // }
});

export default LoginScreen;