import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Platform, StatusBar } from 'react-native';
import React from 'react';

const AboutFUXI = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <Text style={styles.header}>About FUXI</Text>
                <View style={styles.section}>
                    <View style={styles.background}>
                        <Image source={require('../../assets/iStock-1346852801-min.jpg')} style={styles.image} />
                    </View>
                    <Text style={styles.sectionText}>
                        Research has demonstrated the effects of using familiar music as a way to increase brain activity and thereby improving
                        alertness, ability to sustain conversation and physical and mental engagement in People with Dementia. The effect can be
                        transformative and it can restore a sense of dignity for People with Dementia, while also providing relief for caregivers.
                    </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.background}>
                        <Image source={require('../../assets/iStock-1725829212-min.jpg')} style={styles.image} />
                    </View>
                    <Text style={styles.sectionText}>
                        Finding and tracking this music can be additional work for caregivers. This is where FUXI can help. By using a wealth of
                        knowledge developed over a 10 year collaboration between caregivers, healthcare providers, volunteers and People with
                        Dementia, we have developed this free app to help support people anwhere at any time.
                    </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.background}>
                        <Image source={require('../../assets/iStock-1392760745-min.jpg')} style={styles.image} />
                    </View>
                    <Text style={styles.sectionText}>
                        The app will remember your preferences and the more you use the app the more effective it will become. Recommended music is
                        catered especially towards People with Dementia, as it is based on a wealth of research from caregivers and healthcare
                        providers.
                    </Text>
                </View>
                <View style={{ height: 30 }}></View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutFUXI;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    section: {
        paddingVertical: 20,
    },
    background: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: 250,
        objectFit: 'cover',
        borderRadius: 10,
    },
    sectionText: {
        marginTop: 20,
        fontSize: 16,
        color: '#3C4647',
    },
});
