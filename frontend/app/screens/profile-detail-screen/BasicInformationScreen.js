import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';

const BasicInformationScreen = () => {
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
        marginBottom: 88,
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
