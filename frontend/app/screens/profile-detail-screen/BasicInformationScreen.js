import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const BasicInformationScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerDesc}>These information helps us personalize our music therapy for the listener.</Text>
                <View style={styles.profileInfo}>
                    <View style={styles.field}>
                        <Text style={styles.labelField}>Name of listener</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>
                            ninaazarova
                        </Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.labelField}>Year of birth</Text>
                        <Text style={styles.fieldValue}>-</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.labelField}>Preferred language</Text>
                        <Text style={styles.fieldValue}>English</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfileNavigator')}
                    style={{ backgroundColor: '#EEF8F9', alignItems: 'center', justifyContent: 'center', borderRadius: 100, marginTop: 'auto' }}
                >
                    <Text style={{ fontWeight: '500', fontSize: 16, lineHeight: 24, color: '#222C2D', paddingVertical: 12, paddingHorizontal: 20 }}>
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default BasicInformationScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 20,
    },
    profileInfo: {
        flexDirection: 'column',
        gap: 16,
    },
    headerDesc: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
    field: {
        flexDirection: 'column',
        gap: 4,
    },
    labelField: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    fieldValue: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
