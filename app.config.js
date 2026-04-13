const commonConfig = require('./config/common');
const iosConfig = require('./config/ios');
const androidConfig = require('./config/android');

const extra = {
    production: true,
    url: 'https://barasushiback-3tla.onrender.com',
    urlDev: 'http://192.168.110.203:8000',
    eas: {
        projectId: "66b9de4c-45cf-4b45-8904-84f5b94f937b"
    },
    cli: {
        appVersionSource: "remote"
    }
};

module.exports = () => {
    const APP_ENV = process.env.APP_ENV;

    if (APP_ENV === "ios") {
        return {
            ...commonConfig,
            name: "BitBoletosApp",
            slug: "bitboletos-app",
            version: "1.0.0",
            ios: iosConfig,
            extra
        };
    } else if (APP_ENV === "android") {
        return {
            ...commonConfig,
            name: "BitBoletosApp",
            slug: "bitboletos-app",
            version: "1.0.0",
            android: androidConfig,
            extra
        };
    } else {
        return {
            ...commonConfig,
            name: "BitBoletosApp Dev",
            slug: "bitboletos-app-dev",
            version: "1.0.0",
            ios: iosConfig,
            android: androidConfig,
            extra
        };
    }
};
