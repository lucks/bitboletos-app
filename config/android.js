const androidConfig = {
    adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#000000"
    },
    package: 'com.merostudios.bitboletosapp',
    versionCode: 1,
    //googleServicesFile: "./google-services.json",
    config: {
        googleMaps: {
            //apiKey: "AIzaSyDamVlBKWSyBTQSllAdyrOEf06RoWdgdqU"
        }
    },
    permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
    ],
};

module.exports = androidConfig;
