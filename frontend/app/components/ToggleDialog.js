import { StyleSheet, Text, SafeAreaView } from 'react-native';
import React from 'react';
import Dialog from 'react-native-dialog';

const ToggleDialog = ({ visible = false, title, desc, labelYes, labelNo, onPressYes, onPressNo, styleBtnYes }) => {
    return (
        <Dialog.Container visible={visible}>
            <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>{desc}</Dialog.Description>
            <Dialog.Button style={styles.dialogButtonNo} label={labelNo} onPress={onPressNo} />
            <Dialog.Button style={[styles.dialogButtonYes, styleBtnYes]} label={labelYes} onPress={onPressYes} />
        </Dialog.Container>
    );
};

export default ToggleDialog;

const styles = StyleSheet.create({
    dialogTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#1D1B20',
    },
    dialogDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: '#49454F',
        marginBottom: 10,
    },
    dialogButtonNo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3C4647',
    },
    dialogButtonYes: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        backgroundColor: '#315F64',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginLeft: 24,
    },
});
