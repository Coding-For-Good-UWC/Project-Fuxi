import React, { useState } from "react";

import 
{
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback, 
    Image,
    TextInput,
    Button,
    TouchableOpacity, 
    Platform
} from "react-native";

import DatePicker from 'react-native-modern-datepicker';

import colours from "../config/colours";

function DatePickerModel (props) 
{
    return (
        <View style={styles.bg}>
            <DatePicker
                options={{
                    backgroundColor: '#090C08',
                    textHeaderColor: '#FFA25B',
                    textDefaultColor: '#F6E7C1',
                    selectedTextColor: '#fff',
                    mainColor: '#F4722B',
                    textSecondaryColor: '#D6C7A1',
                    borderColor: 'rgba(122, 146, 165, 0.1)',
                }}
                current={props.currentDate}
                selected="2020-07-23"
                mode="calendar"
                minuteInterval={30}
                style={styles.datePicker}
                onDateChange={(date) => props.setDate(date)}
            />
            <Button 
                title="Close" 
                color={colours.blue}
                onPress={props.closeModal}
            />
        </View>
    )
}

const styles = StyleSheet.create
({
    bg: 
    {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        position: "absolute", 
        top: 0, 
        left: 0, 
        bottom: 0, 
        right: 0, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    datePicker: 
    {
        borderRadius: 10, 
        width: 400, 
        height: 350
    }
});

export default DatePickerModel; 