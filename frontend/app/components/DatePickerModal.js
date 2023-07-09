import React from "react";

import { StyleSheet, View } from "react-native";

import DatePicker from "react-native-modern-datepicker";
import StyledButton from "./StyledButton";

import colours from "../config/colours";

function DatePickerModel(props) {
    return (
        <View style={styles.bg}>
            <DatePicker
                options={{
                    backgroundColor: colours.bg,
                    textHeaderColor: colours.primary,
                    textDefaultColor: colours.primaryText,
                    mainColor: colours.primary,
                    textSecondaryColor: colours.secondaryText,
                    borderColor: colours.border,
                }}
                current="1950-01-01"
                selected="1950-01-01"
                mode="calendar"
                minuteInterval={30}
                style={styles.datePicker}
                onDateChange={(date) => props.setDate(date)}
            />
            <StyledButton text="Done" onPress={props.closeModal} />
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    datePicker: {
        borderRadius: 10,
        width: "90%",
        marginBottom: 20
    }
});

export default DatePickerModel;
