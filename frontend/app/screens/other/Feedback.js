import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import { Linking } from 'react-native';

const Feedback = () => {
    const openEmailApp = async () => {
        try {
            await Linking.openURL('mailto:fuximusicapp@gmail.com');
        } catch (error) {
            console.error('Error opening email app: ', error);
        }
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.header}>Feedback</Text>
                    <Text>
                        <Text style={styles.desc}>Please send all feedback or inquiries related to specific issues to the email address</Text>
                        <TouchableOpacity onPress={openEmailApp} style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: '500', fontSize: 16, color: '#137882' }}>fuximusicapp@gmail.com</Text>
                        </TouchableOpacity>
                        <Text style={styles.desc}>
                            . We greatly appreciate your input to help us improve our services and address any potential issues. Our support team will
                            make every effort to respond to and handle all information swiftly and effectively. Please do not hesitate to contact us
                            if you require assistance or have any questions regarding this matter.
                        </Text>
                    </Text>
                    <View></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Feedback;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 20,
        paddingBottom: 30,
    },
    header: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
    },
    desc: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
    headerSection: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 28,
        color: '#3C4647',
    },
    desc2: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
