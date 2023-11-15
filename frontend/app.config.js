export default {
    expo: {
        name: 'FUXI',
        slug: 'FUXI',
        version: '1.0.0',
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
        ios: {
            bundleIdentifier: 'com.uwcfuxi.app',
            supportsTablet: true,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './app/assets/fuxi-high-resolution-logo.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'com.codingforgood.projectfuxi',
        },
        web: {
            favicon: './app/assets/fuxi-high-resolution-logo.png',
        },
        extra: {
            apiUrl: process.env.BACKEND_HOST || 'https://b1xnoo0jdd.execute-api.ap-southeast-1.amazonaws.com',
            serviceacc: process.env.SERVICE_ACCOUNT_EMAILJS || 'service_2ltnpw6',
            templateid: process.env.TEMPLATE_ID_EMAILJS || 'template_v3e5qxl',
            publicapikey: process.env.PUBLIC_API_KEY_EMAILJS || 'Pqb-hgicf_LaXv1mp',
            eas: {
                projectId: '770075d4-9321-43db-8805-322192b9c91e',
            },
        },
    },
};
