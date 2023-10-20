import './firebaseConfig';
import React from 'react';
import { View } from 'react-native';

import { AuthProvider } from './app/context/AuthContext';
import AppNav from './app/navigation/AppNav';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <AuthProvider>
                <AppNav />
            </AuthProvider>
        </View>
    );
}
