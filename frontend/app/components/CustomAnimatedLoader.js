import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AnimatedLoader from 'react-native-animated-loader';

// source animation in link: https://lottiefiles.com/search?q=loader&category=animations

const CustomAnimatedLoader = ({ visible = false, source }) => {
    return (
        <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255, 255, 255, 0.7)"
            animationStyle={styles.loader}
            source={source}
            speed={1}
        >
            <Text style={styles.loaderText}>Loading...</Text>
        </AnimatedLoader>
    );
};

export default CustomAnimatedLoader;

const styles = StyleSheet.create({
    loader: {
        width: 100,
        height: 100,
    },
    loaderText: {
        fontSize: 16,
        marginTop: 10,
    },
});
