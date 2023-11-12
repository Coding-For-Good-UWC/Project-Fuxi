import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomGridLayout from './CustomGridLayout';

const PickerItem = ({ item, onChangeValue }) => {
    return (
        <View style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => onChangeValue(item)} style={{ padding: 16 }}>
                <Text numberOfLines={1}>{item}</Text>
            </TouchableOpacity>
        </View>
    );
};

const Picker = ({ dataArray, onValueChange, visible }) => {
    const { height, width } = Dimensions.get('window');

    const handlePress = (item) => {
        onValueChange(item);
        visible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={() => visible(false)} style={{ flex: 1 }}>
            <Animatable.View
                animation="fadeIn"
                duration={500}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(52, 52, 52, 0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        height: height * 0.7,
                        width: width * 0.9,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#444444',
                    }}
                >
                    <CustomGridLayout
                        data={dataArray.map((item, index) => (
                            <PickerItem key={index} item={item} onChangeValue={handlePress} />
                        ))}
                        columns={1}
                    />
                </View>
            </Animatable.View>
        </TouchableWithoutFeedback>
    );
};

export default Picker;
