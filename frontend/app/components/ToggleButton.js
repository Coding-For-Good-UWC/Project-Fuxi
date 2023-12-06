import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ToggleButton = ({
    isDisabled,
    onPress,
    lable,
    backgroundColorActive,
    backgroundColorInactive,
    colorActive,
    colorInactive,
    styleButton,
    styleText,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: isDisabled ? backgroundColorActive : backgroundColorInactive,
                },
                styleButton,
            ]}
            disabled={!isDisabled}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.buttonText,
                    {
                        color: isDisabled ? colorActive : colorInactive,
                    },
                    styleText,
                ]}
            >
                {lable}
            </Text>
        </TouchableOpacity>
    );
};

export default ToggleButton;

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
