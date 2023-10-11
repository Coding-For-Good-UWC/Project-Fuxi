import './firebaseConfig';
import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import LoadingContext from './app/store/LoadingContext';
import LoadingScreen from './app/components/LoadingScreen';

import { AuthProvider } from './app/context/AuthContext';
import AppNav from './app/navigation/AppNav';

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const isLoadingContextValue = useMemo(() => ({ isLoading, setIsLoading }), [isLoading, setIsLoading]);

    useEffect(() => {
        if (isLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, fadeAnim]);

    return (
        <View style={styles.container}>
            <LoadingContext.Provider value={isLoadingContextValue}>
                <AuthProvider>
                    <AppNav />
                </AuthProvider>
            </LoadingContext.Provider>
            {isLoading && <LoadingScreen fadeAnim={fadeAnim} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
