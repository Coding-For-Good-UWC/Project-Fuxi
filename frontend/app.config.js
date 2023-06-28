export default {
  expo: {
    name: "ProjectFUXI",
    slug: "ProjectFUXI",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.codingforgood.projectfuxi",
    },
    web: {
      favicon: "./app/assets/favicon.png",
    },
    extra: {
      apiUrl: process.env.BACKEND_HOST || "http://localhost:8080",
      eas: {
        projectId: "770075d4-9321-43db-8805-322192b9c91e",
      },
    },
  },
};
