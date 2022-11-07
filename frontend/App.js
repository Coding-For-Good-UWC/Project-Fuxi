import LandingScreen from './app/screens/LandingScreen';
import LoginScreen from './app/screens/LoginScreen';
import PlayerScreen from './app/screens/PlayerScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Platform } from 'react-native'; 

// import TrackPlayer from 'react-native-track-player';

const Stack = createNativeStackNavigator();

// TrackPlayer.registerPlaybackService (() => require ('./service')); 

export default function App() 
{
  console.log ("APP EXECUTED"); 
  
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
          name="Player" 
          component={PlayerScreen} 
          options={{ headerShown: Platform.OS !== 'web' }}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // <PlayerScreen />
  )
}