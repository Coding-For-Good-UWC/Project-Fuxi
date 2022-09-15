import {Button, StyleSheet} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useEffect } from 'react'

const loginUser = (navigation) => {
  return async(evt) => {
    evt.preventDefault()
    const username = document.getElementById('inputUsername').value
    const password = document.getElementById('inputPassword').value
    const result = await fetch('http://localhost:8080/v1/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          "username": username,
          "password": password
        }
      )
    }).then(res => res.json())
    if (result.status !== 'ok'){
      alert(result.error_message)
    } else {
      navigation.navigate('TabTwo')
    }
  }
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  //Dismissible bootstrap error alert
  useEffect(() => {
    const url = new URL(location.href)
    if (url.searchParams.get('error')){
      if (url.searchParams.get('error') == 'user-not-logged-in'){
        alert('Error: User not logged in, please log in to access page')
      } else if (url.searchParams.get('error') == 'expired-token'){
        alert('Error: Your session has expired, please login again')
      } else if (url.searchParams.get('error') == 'invalid-token'){
        alert('Error: Invalid login details, please sign in again')
      } else if (url.searchParams.get('error') == 'wrong-token'){
        alert('Error: Invalid login token, please try again')
      }  
    }
    if (url.searchParams.get('status')){
      if(url.searchParams.get('status') == 'verified'){
        alert('You are now logged in')
      }
    }
  }, [])

  return (
    <View>
      <Text>Login</Text>
      <form onSubmit = {loginUser(navigation)}>
        <div>
          <input name="username" id="inputUsername" required/>
          <Text>We'll never share your email with anyone else.</Text>
        </div>
        <div>
          <input name="password" type="password" id="inputPassword" required/>
          <Text>Your password must be 8-20 characters long, contain uppercase and lowercase letters and numbers, and must not contain spaces, special characters, or emoji.</Text>
        </div>
        <button type="submit"><Text style={{color: "black"}}>Login</Text></button>
      </form>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
