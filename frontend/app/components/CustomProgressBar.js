import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

function CustomProgressBar({ progress, color, backgroundColor, duration, radius, height = 10, sliderStyle, progressStyle }) {
    const [animatedWidth, setAnimatedWidth] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress * 100,
            duration: duration,
            useNativeDriver: false,
        }).start();
    }, [progress, animatedWidth]);

    return (
        <View
            style={[
                {
                    height: height,
                    backgroundColor: backgroundColor,
                    borderRadius: radius,
                },
                progressStyle,
            ]}
        >
            <Animated.View
                style={[
                    {
                        width: animatedWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: color,
                        height: '100%',
                        borderRadius: radius,
                    },
                    sliderStyle,
                ]}
            />
        </View>
    );
}

export default CustomProgressBar;
