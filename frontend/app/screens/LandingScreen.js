import React, { useState } from 'react';
 
import {
   StyleSheet,
   Text,
   Button,
   View,
   Image, 
   ScrollView, 
   Dimensions,
   TouchableOpacity
} from 'react-native';
 
import colours from '../config/colours.js';

const carouselImages = [
    require("../assets/carousel-images/image-1.jpg"), 
    require("../assets/carousel-images/image-2.jpg"), 
    require("../assets/carousel-images/image-3.jpg"), 
    require("../assets/carousel-images/image-4.jpg")
]

// const { width } = Dimensions.get("window"); 
// const height = width * 0.6; 

function LandingScreen({ navigation }) 
{
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState (0); 

    const updateCarouselBullets = ({nativeEvent}) => 
    {
        const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width); 
        if (slide !== currentCarouselIndex)
            setCurrentCarouselIndex (slide); 
    }

    return (
       <View style={styles.container}>
            <View style={styles.carouselContainer} pointerEvents={'auto'}>
                <ScrollView 
                    pagingEnabled
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    style={styles.carouselScrollView}
                    onScroll={updateCarouselBullets}
                >
                {
                    carouselImages.map ((image, index) => (
                        <Image source={image} key={index} style={styles.carouselImage}></Image>
                    ))
                }
                </ScrollView>
                <View style={styles.carouselBulletContainer}>
                    {
                        carouselImages.map ((item, index) => <Text style={index == currentCarouselIndex ? styles.carouselBulletActive : styles.carouselBullet} key={index}>⬤</Text>)
                    
                    }
                </View>
                <View style={styles.carouselOverlay} pointerEvents={'none'}>
                    <Text style={styles.titleText}>Project FUXI</Text>
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.bodyCard}>
                    <View style={styles.fuxiImageContainer}>
                        <Image source={require('../assets/fuxiIcon.png')} style={styles.fuxiImage} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.subtitleText}>Project FUXI</Text>
                        <Text numberOfLines={10} style={styles.descriptionText}>Project Fuxi is an initiative aiming to increaes the quality of life of dementia patients through the use of Music Therapy. Music, combined with detailed data collection, autobiographical information, and user-friendly solutions, can have a significant impact on the well-being of those with dementia. As the areas of the brain that process musical memory are some of the last to be affected, carefully curated and individualised music can encourage brain activity and animate those who would otherwise be quiet and confused.</Text>
                        <Button 
                            title="Login" 
                            color={colours.blue}
                            onPress={() => navigation.navigate("Login")}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.parallaxContainer}>
                <Image source={require ('../assets/carousel-images/image-1.jpg')} style={styles.parallaxImage} />
            </View>
       </View>
   );
}
 
const styles = StyleSheet.create({
    container: 
    {
        flex: 1
    }, 
    carouselContainer: 
    {
        width: "100%", 
        height: "100%" 
    },  
    carouselScrollView: 
    {
        width: "100%", 
        height: "100%"
    }, 
    carouselImage: 
    {
        width: Dimensions.get('window').width, 
        height: "100%", 
        resizeMode: 'cover', 
    }, 
    carouselBulletContainer: 
    {
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 20, 
        alignSelf: 'center', 
    }, 
    carouselBullet: 
    {
        color: '#888', 
        margin: 3
    }, 
    carouselBulletActive: 
    {
        color: '#fff', 
        margin: 3
    }, 
    carouselOverlay: 
    {
        height: "100%",
        width: "100%",
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
        // pointer-events: none; 
    }, 
    titleText: 
    {
        color: "white",
        fontSize: 80, 
        paddingBottom: 100
    }, 

    bodyContainer: 
    {
        backgroundColor: colours.bg, 
        height: 660, 
        paddingLeft: "10%", 
        paddingRight: "10%", 
        paddingTop: "7%", 
        paddingBottom: "7%", 
        width: "100%", 
    }, 
    bodyCard: 
    {
        backgroundColor: colours.charcoal, 
        flexDirection: 'row', 
        borderRadius: 15, 
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 15 },
        shadowRadius: 5,
        shadowOpacity: 0.3, 
        paddingLeft: "5%", 
        paddingRight: "5%", 
        width: "100%", 
        height: "100%"
    }, 
    fuxiImageContainer: 
    {
        flex: 1, 
        // backgroundColor: "green", 
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    fuxiImage: 
    {
        width: "100%", 
        aspectRatio: 1
    }, 
    descriptionContainer: 
    {
        flex: 2, 
        // backgroundColor: "red", 
        // justifyContent: 'center', 
        paddingTop: "5%"
    }, 
    subtitleText: 
    {
        color: colours.text, 
        fontSize: 30, 
        fontWeight: 'bold', 
        paddingBottom: 20
    }, 
    descriptionText: 
    {
        color: colours.text, 
        fontSize: 23, 
        lineHeight: 30, 
        paddingBottom: 20
    }, 
    parallaxContainer: 
    {
        height: 400, 
        width: "100%", 
    }, 
    parallaxImage: 
    {
        resizeMode: 'cover', 
        width: "100%", 
        height: "100%"
    }
});
 
export default LandingScreen; 
