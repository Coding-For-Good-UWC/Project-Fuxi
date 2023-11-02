export default {
    expo: {
        name: 'ProjectFUXI',
        slug: 'ProjectFUXI',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './app/assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './app/assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            infoPlist: {
                UIBackgroundModes: ['audio'],
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './app/assets/adaptive-icon.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'com.codingforgood.projectfuxi',
        },
        web: {
            favicon: './app/assets/favicon.png',
        },
        extra: {
            apiUrl: process.env.BACKEND_HOST || 'http://10.10.12.33:3000',
            serviceacc: process.env.SERVICE_ACCOUNT_EMAILJS || 'service_2ltnpw6',
            templateid: process.env.TEMPLATE_ID_EMAILJS || 'template_v3e5qxl',
            publicapikey: process.env.PUBLIC_API_KEY_EMAILJS || 'Pqb-hgicf_LaXv1mp',
            eas: {
                projectId: '770075d4-9321-43db-8805-322192b9c91e',
            },
        },
    },
};
