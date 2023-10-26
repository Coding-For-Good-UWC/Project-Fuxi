import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Platform, StatusBar } from 'react-native';
import React from 'react';

const TermsAndConditions = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.header}>Terms & Conditions</Text>
                    {/* <Text style={styles.desc}>
                        These terms and conditions create a contract between you and Apple (the “Agreement”). Please read the Agreement carefully.
                    </Text>
                    <Text style={styles.headerSection}>A. INTRODUCTION TO OUR SERVICES</Text>
                    <Text style={styles.desc}>
                        This Agreement governs your use of Apple’s Services (“Services” – e.g., and where available, App Store, Apple Arcade, Apple
                        Books, Apple Fitness+, Apple Music, Apple News, Apple News+, Apple One, Apple Podcasts, Apple Podcasts Subscriptions, Apple
                        TV, Apple TV+, Apple TV Channels, Game Center, iTunes), through which you can buy, get, license, rent or subscribe to content,
                        Apps (as defined below), and other in-app services (collectively, “Content”). Content may be offered through the Services by
                        Apple or a third party. Our Services are available for your use in your country or territory of residence (“Home Country”). By
                        creating an account for use of the Services in a particular country or territory you are specifying it as your Home Country.
                        To use our Services, you need compatible hardware, software (latest version recommended and sometimes required) and Internet
                        access (fees may apply). Our Services’ performance may be affected by these factors.
                    </Text>
                    <Text style={styles.headerSection}>B. USING OUR SERVICES</Text>
                    <Text style={styles.desc2}>PAYMENTS, TAXES, AND REFUNDS</Text> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndConditions;

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
