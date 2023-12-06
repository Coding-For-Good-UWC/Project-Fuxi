import { StyleSheet, Text, View, Animated, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Picker from './Picker';

const SelectElementEffectLabel = ({ dataArray, label, error, onValueChange, defaultValue }) => {
    const [selectedItem, setSelectedItem] = useState(defaultValue || '');
    const [isModalVisible, setIsModalVisible] = useState(false);
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
        setSelectedItem(itemValue);
        onValueChange(itemValue);
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
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
                <View style={{ height: 34, justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#3C4647',
                        }}
                    >
                        {selectedItem}
                    </Text>
                </View>
                <Modal visible={isModalVisible} transparent animationType="fade">
                    <Picker
                        dataArray={dataArray}
                        onValueChange={(item) => handlePickerChange(item)}
                        visible={() => setIsModalVisible(!isModalVisible)}
                    />
                </Modal>
            </TouchableOpacity>
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
