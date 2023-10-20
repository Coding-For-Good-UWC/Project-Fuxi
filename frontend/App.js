import './firebaseConfig';
import React from 'react';
import { View } from 'react-native';

import { AuthProvider } from './app/context/AuthContext';
import AppNav from './app/navigation/AppNav';
import CustomAnimatedLoader from './app/components/CustomAnimatedLoader';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <AuthProvider>
                <AppNav />
                <CustomAnimatedLoader />
            </AuthProvider>
        </View>
    );
}
