require('dotenv').config();

export default {
    expo: {
        name: 'FUXI',
        slug: 'FUXI',
        version: '1.0.1',
        orientation: 'portrait',
        icon: './app/assets/fuxi-high-resolution-logo.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './app/assets/fuxi-high-resolution-logo-transparent.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        permissions: ['AUDIO_RECORDING'],
        ios: {
            bundleIdentifier: 'com.uwcfuxi.app',
            supportsTablet: true,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                LSApplicationQueriesSchemes: [
                    'mailto',
                    'message',
                    'readdle-spark',
                    'airmail',
                    'ms-outlook',
                    'googlegmail',
                    'inbox-gmail',
                    'ymail',
                    'superhuman',
                    'yandexmail',
                    'fastmail',
                    'protonmail',
                    'szn-email',
                ],
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './app/assets/fuxi-high-resolution-logo.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'com.codingforgood.projectfuxi',
            versionCode: 5,
        },
        web: {
            favicon: './app/assets/fuxi-high-resolution-logo.png',
        },
        extra: {
            apiUrl: process.env.BACKEND_HOST || 'http://0.0.0.0:3000',
            eas: {
                projectId: process.env.EAS_PROJECTID || '',
            },
        },
    },
    plugins: [
        [
            'expo-av',
            {
                microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
            },
        ],
        'react-native-email-link',
    ],
};
