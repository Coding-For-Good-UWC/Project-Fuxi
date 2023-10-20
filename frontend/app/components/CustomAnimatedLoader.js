import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { AuthContext } from '../context/AuthContext';

// source animation in link: https://lottiefiles.com/search?q=loader&category=animations

const CustomAnimatedLoader = () => {
    const { isLoading } = useContext(AuthContext);
    return (
        <AnimatedLoader
            visible={isLoading}
            overlayColor="rgba(255, 255, 255, 0.7)"
            animationStyle={styles.AnimatedLoader}
            source={require('../assets/loader/cat-loader.json')}
            speed={1}
        >
            <Text style={styles.loaderText}>Loading...</Text>
        </AnimatedLoader>
    );
};

export default CustomAnimatedLoader;

const styles = StyleSheet.create({
    AnimatedLoader: {},
    loaderText: {
        position: 'absolute',
        fontSize: 16,
        fontWeight: '600',
        bottom: '38%',
    },
});
