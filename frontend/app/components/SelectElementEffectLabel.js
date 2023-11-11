import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';

const SelectElementEffectLabel = ({ dataArrayObject, label, error, onValueChange }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const placeholderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (selectedItem !== undefined && selectedItem !== '') {
            Animated.timing(placeholderAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(placeholderAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [selectedItem]);

    const handlePickerChange = (itemValue) => {
        console.log(itemValue);
        setSelectedItem(itemValue);
        onValueChange(itemValue);
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <View>
                <Animated.Text
                    style={{
                        position: 'absolute',
                        top: placeholderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-4, -14],
                        }),
                        fontSize: placeholderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [16, 12],
                        }),
                        color: error
                            ? '#C31E1E'
                            : placeholderAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['#757575', '#539ca4'],
                              }),
                    }}
                >
                    {label}
                </Animated.Text>
                <RNPickerSelect
                    onValueChange={(value) => handlePickerChange(value)}
                    items={dataArrayObject}
                    placeholder={''}
                    useNativeAndroidPickerStyle={false}
                />
            </View>
            <Animated.View
                style={{
                    borderBottomColor: error
                        ? '#C31E1E'
                        : placeholderAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['#DFE0E2', '#72aeb4'],
                          }),
                    borderBottomWidth: 2,
                }}
            ></Animated.View>
            <View style={styles.error}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        </View>
    );
};

export default SelectElementEffectLabel;

const styles = StyleSheet.create({
    error: {
        height: 18,
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});
