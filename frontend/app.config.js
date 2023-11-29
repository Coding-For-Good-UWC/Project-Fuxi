export default {
    expo: {
        name: "FUXI",
        slug: "FUXI",
        version: "1.0.1",
        orientation: "portrait",
        icon: "./app/assets/fuxi-high-resolution-logo.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./app/assets/fuxi-high-resolution-logo-transparent.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        permissions: ["AUDIO_RECORDING"],
        ios: {
            bundleIdentifier: "com.uwcfuxi.app",
            supportsTablet: true,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                LSApplicationQueriesSchemes: [
                    "mailto",
                    "message",
                    "readdle-spark",
                    "airmail",
                    "ms-outlook",
                    "googlegmail",
                    "inbox-gmail",
                    "ymail",
                    "superhuman",
                    "yandexmail",
                    "fastmail",
                    "protonmail",
                    "szn-email",
                ],
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./app/assets/fuxi-high-resolution-logo.png",
                backgroundColor: "#FFFFFF",
            },
            package: "com.codingforgood.projectfuxi",
            versionCode: 5,
        },
        web: {
            favicon: "./app/assets/fuxi-high-resolution-logo.png",
        },
        extra: {
            apiUrl:
                process.env.BACKEND_HOST ||
                "https://b1xnoo0jdd.execute-api.ap-southeast-1.amazonaws.com",
            serviceacc:
                process.env.SERVICE_ACCOUNT_EMAILJS || "service_2ltnpw6",
            templateid: process.env.TEMPLATE_ID_EMAILJS || "template_v3e5qxl",
            publicapikey:
                process.env.PUBLIC_API_KEY_EMAILJS || "Pqb-hgicf_LaXv1mp",
            eas: {
                projectId: "770075d4-9321-43db-8805-322192b9c91e",
            },
        },
    },
    plugins: [
        [
            "expo-av",
            {
                microphonePermission:
                    "Allow $(PRODUCT_NAME) to access your microphone.",
            },
        ],
        "react-native-email-link",
    ],
};
