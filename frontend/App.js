import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import LandingScreen from './app/screens/LandingScreen';

import LoginScreen from './app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';
// import CaregiverDashboard from './app/screens/CaregiverDashboard'; 
import PlayerScreen from './app/screens/PlayerScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Platform } from 'react-native'; 

import PatientRegistration from './app/screens/PatientRegistration';
import PatientMusicForm from './app/screens/PatientMusicForm';

import LoadingContext from './app/store/LoadingContext';
import LoadingScreen from './app/components/LoadingScreen';

const Stack = createNativeStackNavigator();

export default function App() 
{
  const [isLoading, setIsLoading] = useState (false); 
  const isLoadingContextValue = useMemo (() => ({ isLoading, setIsLoading }), [isLoading, setIsLoading]); 

  return (
    <View style={styles.container}>
    <LoadingContext.Provider value={isLoadingContextValue}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ 
            title: 'Welcome', 
            headerShown: false, 
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PatientRegistration" 
          component={PatientRegistration} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PatientMusicForm" 
          component={PatientMusicForm} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </LoadingContext.Provider>
    { isLoading && <LoadingScreen />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});