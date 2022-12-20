import LandingScreen from './app/screens/LandingScreen';
import LoginScreen from './app/screens/LoginScreen';
import CaregiverDashboard from './app/screens/CaregiverDashboard'; 
import PlayerScreen from './app/screens/PlayerScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Platform } from 'react-native'; 

import PatientRegistration from './app/screens/PatientRegistration';
import PatientMusicForm from './app/screens/PatientMusicForm';

const Stack = createNativeStackNavigator();

export default function App() 
{
  console.log ("APP EXECUTED"); 

  // return <PatientMusicForm/ >; 
  // return <PatientRegistration/ >; 
  
  return (
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
          options={{ headerShown: Platform.OS !== 'web' }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={CaregiverDashboard} 
          options={{ headerShown: Platform.OS !== 'web' }}
        />
        <Stack.Screen 
          name="PatientRegistration" 
          component={PatientRegistration} 
          options={{ headerShown: Platform.OS !== 'web' }}
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen} 
          options={{ headerShown: Platform.OS !== 'web' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}