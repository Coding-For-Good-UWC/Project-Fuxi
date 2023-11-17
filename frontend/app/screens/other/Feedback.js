import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import { openInbox } from 'react-native-email-link';

const Feedback = () => {
    const openEmailApp = async () => {
        try {
            openInbox({ to: 'fuximusicapp@gmail.com' });
        } catch (error) {
            console.error('Error opening email app: ', error);
            alert(error);
        }
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <Text style={styles.header}>Feedback</Text>
                    <Text>
                        <Text style={styles.desc}>Please send all feedback or inquiries related to specific issues to the email address</Text>
                        <TouchableOpacity onPress={openEmailApp}>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    fontSize: 16,
                                    color: '#137882',
                                }}
                            >
                                fuximusicapp@gmail.com
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.desc}>
                            . We greatly appreciate your input to help us improve our services and address any potential issues. Our support team will
                            make every effort to respond to and handle all information swiftly and effectively. Please do not hesitate to contact us
                            if you require assistance or have any questions regarding this matter.
                        </Text>
                    </Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Feedback;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        paddingHorizontal: 20,
    },
    header: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
        marginBottom: 14,
    },
    desc: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
