import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from "react-native";

import colours from "../config/colours.js";

const { width, height } = Dimensions.get("window");
const parallaxImageHeight = height;

function LandingScreen({ navigation }) {
    const scrollY = new Animated.Value(0);

    const parallaxImageStyle = (imageIndex) => {
        return {
            height: scrollY.interpolate({
                inputRange: [
                    -parallaxImageHeight,
                    parallaxImageHeight * imageIndex,
                    parallaxImageHeight * (imageIndex + 1),
                ],
                outputRange: [
                    parallaxImageHeight * 2,
                    parallaxImageHeight,
                    parallaxImageHeight * 0.5,
                ],
                extrapolate: "clamp",
            }),
        };
    };

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                style={styles.scrollView}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.innerContent}>
                    <View style={styles.mainContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Project FUXI</Text>
                        </View>
                        <Image
                            style={styles.image}
                            source={require("../assets/fuxiIcon.png")}
                        />
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => navigation.navigate("Login")}
                            underlayColor={colours.highlight}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => navigation.navigate("Signup")}
                            underlayColor={colours.highlight}
                        >
                            <Text style={styles.buttonText}>Signup</Text>
                        </TouchableOpacity>
                    </View>

                    <Animated.Image
                        style={[styles.parallaxImage, parallaxImageStyle(0)]}
                        source={require("../assets/parallax1.jpg")}
                    />
                    <View style={styles.whiteSection}>
                        <Text style={styles.whiteSectionText}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit augue at ante efficitur lobortis. Ut vehicula lobortis velit, sit amet interdum orci sagittis sit amet. Donec condimentum luctus luctus. Sed scelerisque placerat arcu ac dapibus.
                        </Text>
                        <Image
                            style={styles.whiteSectionImage}
                            source={require("../assets/image2.jpg")}
                        />
                    </View>

                    <Animated.Image
                        style={[styles.parallaxImage, parallaxImageStyle(1)]}
                        source={require("../assets/parallax2.jpg")}
                    />
                    <View style={styles.footerContent}>
                        <Text style={styles.footerText}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
    },
    scrollView: {
        flex: 1,
    },
    mainContent:
    {
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 30,
        height
    },  
    titleContainer: {
        borderBottomWidth: 2,
        borderBottomColor: colours.primary,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 32,
        color: colours.primaryText,
        paddingBottom: 20,
        fontWeight: "500",
    },
    image: {
        height: 100,
        aspectRatio: 1,
        marginBottom: 70,
    },
    buttonContainer: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 120,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
    parallaxImage: {
        width,
        height: height,
        resizeMode: "cover",
    },
    innerContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    whiteSection: {
        backgroundColor: "white",
        padding: 60,
        alignItems: "center",
    },
    whiteSectionText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    whiteSectionImage: {
        width: width * 0.8,
        height: height * 0.3,
        resizeMode: "cover",
        borderRadius: 10,
    },
    footerContent: {
        minHeight: height * 0.5,
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        color: colours.primaryText,
        fontSize: 20,
        paddingHorizontal: 30,
        textAlign: "center",
    },
});

export default LandingScreen;
