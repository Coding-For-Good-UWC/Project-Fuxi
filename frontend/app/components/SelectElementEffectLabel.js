import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';

const SelectElementEffectLabel = ({ dataArray, label, error, onValueChange, value }) => {
    const [selectedItem, setSelectedItem] = useState(value || '');
    const [pickerSelected, setPickerSelected] = useState(false);
    const placeholderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setPickerSelected(true);
        Animated.timing(placeholderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        if (!pickerSelected) {
            Animated.timing(placeholderAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const handlePickerChange = (itemValue) => {
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
                <Picker
                    selectedValue={selectedItem}
                    onValueChange={handlePickerChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                        marginHorizontal: -16,
                        marginVertical: -12,
                    }}
                >
                    {pickerSelected &&
                        dataArray.map((item, index) => <Picker.Item key={index} label={item} value={item} style={{ color: '#3C4647' }} />)}
                </Picker>
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
