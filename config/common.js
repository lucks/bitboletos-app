const commonConfig = {
    orientation: 'portrait',
    icon: "./assets/images/icon.png",
    androidStatusBar: {
        translucent: true
    },
    splash: {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#000000"
    },


    assetBundlePatterns: [
        "**/*"
    ],
    web: {
        favicon: "./assets/favicon.png"
    },
    updates: {
        enabled: false,
        //dev-version
        url: "https://u.expo.dev/66160f43-7938-4b2c-af8a-e769439e2fa1"
    },
    runtimeVersion: {
        policy: "appVersion"
    },
    plugins: [
        [
            "expo-location", { locationAlwaysAndWhenInUsePermission: "Allow to use your location." },

        ],
        "expo-font",
        "expo-router",
        "expo-secure-store",
        "expo-web-browser"
    ],
    owner: "bitboletosapp",
};

module.exports = commonConfig;