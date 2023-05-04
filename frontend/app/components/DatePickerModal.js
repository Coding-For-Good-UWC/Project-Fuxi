import React, { useState } from "react";

import 
{
    StyleSheet,
    View,
    Button
} from "react-native";

import DatePicker from 'react-native-modern-datepicker';

import colours from "../config/colours";

function DatePickerModel(props) {
    return (
      <View style={styles.bg}>
        <DatePicker
          options={{
            backgroundColor: colours.secondary,
            textHeaderColor: colours.primary,
            textDefaultColor: colours.primaryText,
            selectedTextColor: colours.white,
            mainColor: colours.primary,
            textSecondaryColor: colours.secondaryText,
            borderColor: colours.border,
          }}
          current={props.currentDate}
          selected="1950-01-01"
          mode="calendar"
          minuteInterval={30}
          style={styles.datePicker}
          onDateChange={(date) => props.setDate(date)}
        />
        <Button
          title="Close"
          color={colours.primary}
          onPress={props.closeModal}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    bg: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    datePicker: {
      borderRadius: 10,
      width: 400,
      height: 350,
    },
  });

export default DatePickerModel;