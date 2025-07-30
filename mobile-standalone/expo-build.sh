#!/bin/bash

echo "🚀 Building AgriTrace360 Mobile App for Download"

# Create a simplified Expo app structure
cat > app.json << EOF
{
  "expo": {
    "name": "AgriTrace360 LACRA",
    "slug": "agritrace360-lacra",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#16a34a"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#16a34a"
      },
      "package": "com.lacra.agritrace360"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOF

# Create a simple package.json for standalone build
cat > package.json << EOF
{
  "name": "agritrace360-mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "expo-location": "~16.1.0",
    "expo-camera": "~13.4.0",
    "expo-barcode-scanner": "~12.5.0",
    "expo-sqlite": "~11.3.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "expo-status-bar": "~1.6.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
EOF

echo "✅ Mobile app configuration created"
echo "📱 To build and download:"
echo "1. Run: npx create-expo-app@latest AgriTrace360 --template blank"  
echo "2. Run: cd AgriTrace360"
echo "3. Run: npx expo start --tunnel"
echo "4. Scan QR code with Expo Go app"
echo ""
echo "🔥 For APK download:"
echo "1. Create account at expo.dev"
echo "2. Run: npx expo login"
echo "3. Run: eas build --platform android"
echo "4. Download APK from build URL"