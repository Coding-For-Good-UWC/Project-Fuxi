import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TipComponent = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="information-circle-outline" size={24} color="#137882" />
                <Text style={styles.tipText}>Tip</Text>
                <TouchableOpacity>
                    <Ionicons name="close" size={24} color="#757575" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.descText}>Your song rating helps us recommend better song for you!</Text>
                <TouchableOpacity style={styles.moreView} onPress={() => navigation.navigate('RateSongsScreen')}>
                    <Text style={styles.moreText}>Learn more</Text>
                    <Ionicons name="arrow-forward-outline" size={24} color="#137882" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TipComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EEF8F9',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#137882',
        padding: 16,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
    },
    tipText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: 38,
        marginTop: 4,
        gap: 12,
    },
    descText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#3C4647',
    },
    moreView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    moreText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#137882',
    },
});
