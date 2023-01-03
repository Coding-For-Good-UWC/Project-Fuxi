import React, { useState } from "react";
import CredentialForm from "./app/components/CredentialForm";

function App() {
  const [username, setUsername] = useState(null);

  const attemptLogin = 
    async (body) => {
      console.log ("ATTEMPT LOGIN"); 
      const response = await fetch("http://localhost:8080/institute/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log ("LOGGED IN SUCCESSFULLY"); 
      } else {
        const data = await response.json();
        console.log(data);
      }


      response = await fetch("http://localhost:8080/institute");
      if (response.ok) {
        console.log ("A");
        const data = await response.json();
        setUsername(data.username);
      } else {
        console.log ("B"); 
        setUsername(null);
      }
    };

  return (
    <div>
      {username === null ? (
        <CredentialForm
          onLogin={attemptLogin}
        />
      ) : (
        <div>
          <div>Welcome, {username}!</div>
        </div>
      )}
    </div>
  );
}

export default App;















// import LandingScreen from './app/screens/LandingScreen';

// import LoginScreen from './app/screens/LoginScreen';
// import CaregiverDashboard from './app/screens/CaregiverDashboard'; 
// import PlayerScreen from './app/screens/PlayerScreen';

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { Platform } from 'react-native'; 

// import PatientRegistration from './app/screens/PatientRegistration';
// import PatientMusicForm from './app/screens/PatientMusicForm';

// const Stack = createNativeStackNavigator();

// export default function App() 
// {
//   console.log ("APP EXECUTED"); 

//   // return <PatientRegistration/ >; 
//   // return <PatientMusicForm/ >; 
//   // return <CaregiverDashboard />; 
  
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Landing"
//           component={LandingScreen}
//           options={{ 
//             title: 'Welcome', 
//             headerShown: false, 
//           }}
//         />
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ headerShown: Platform.OS !== 'web' }}
//         />
//         <Stack.Screen 
//           name="PatientRegistration" 
//           component={PatientRegistration} 
//           options={{ headerShown: Platform.OS !== 'web' }}
//         />
//         <Stack.Screen 
//           name="PatientMusicForm" 
//           component={PatientMusicForm} 
//           options={{ headerShown: Platform.OS !== 'web' }}
//         />
//         <Stack.Screen 
//           name="Dashboard" 
//           component={CaregiverDashboard} 
//           options={{ headerShown: Platform.OS !== 'web' }}
//         />
//         <Stack.Screen 
//           name="Player" 
//           component={PlayerScreen} 
//           options={{ headerShown: Platform.OS !== 'web' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }