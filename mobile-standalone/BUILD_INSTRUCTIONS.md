# 📱 AgriTrace360™ LACRA Mobile App - Build Instructions

## How to Generate APK and iOS Files

The mobile app is currently in development mode. To create downloadable APK (Android) and IPA (iOS) files, follow these steps:

## 🔧 Prerequisites

1. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

2. **Create Expo Account**
   - Go to https://expo.dev/signup
   - Create a free account
   - Login with: `expo login`

## 📱 Build APK for Android

### Method 1: Using Expo Build Service (Recommended)
```bash
cd mobile-standalone
expo build:android --type apk
```

This will:
- Upload your code to Expo's build service
- Generate a signed APK file
- Provide download link when complete (usually 10-15 minutes)

### Method 2: Local Build (Advanced)
```bash
cd mobile-standalone
npx eas build --platform android --local
```

## 🍎 Build IPA for iOS

### Method 1: Using Expo Build Service
```bash
cd mobile-standalone
expo build:ios --type simulator
```

For device installation:
```bash
expo build:ios --type archive
```

### Method 2: Local Build
```bash
cd mobile-standalone
npx eas build --platform ios --local
```

**Note**: iOS builds require Apple Developer Account ($99/year)

## 🚀 Quick Build Commands

### For Testing (APK only)
```bash
cd mobile-standalone
expo build:android --type apk --no-publish
```

### For Production (Both platforms)
```bash
cd mobile-standalone
expo build:android --type app-bundle
expo build:ios --type archive
```

## 📦 Build Configuration

The app is configured with:
- **Package Name**: `com.lacra.agritrace360.mobile`
- **Bundle ID**: `com.lacra.agritrace360.mobile`
- **Version**: 1.0.0
- **Permissions**: GPS, Camera, Storage

## 🔑 Required Permissions

The mobile app requests these permissions:
- **Location Access**: For GPS farm boundary mapping
- **Camera Access**: For QR code scanning
- **Storage Access**: For offline data storage

## 📋 Build Status Check

After starting a build, check status:
```bash
expo build:status
```

## 💾 Alternative: Expo Go App (Testing)

For immediate testing without building:

1. **Install Expo Go** on your phone:
   - Android: Google Play Store
   - iOS: Apple App Store

2. **Start development server**:
   ```bash
   cd mobile-standalone
   npm start
   ```

3. **Scan QR code** with Expo Go app

## 🔧 Build Troubleshooting

### Common Issues:

**"No Android SDK found"**
```bash
expo install expo-dev-client
expo run:android
```

**"iOS build failed"**
- Requires Apple Developer Account
- Use simulator build for testing: `--type simulator`

**"Build queue is full"**
- Free Expo accounts have build limits
- Upgrade to paid plan or wait

## 📱 Direct APK Download Setup

To create downloadable APK files directly:

1. **Start build process**:
   ```bash
   cd mobile-standalone
   expo build:android --type apk
   ```

2. **Monitor build progress**:
   ```bash
   expo build:status
   ```

3. **Download completed APK**:
   - Build completes in 10-20 minutes
   - Download link provided in terminal
   - APK file ready for installation

## 🌐 Web Version (Immediate Testing)

For instant testing without device setup:
```bash
cd mobile-standalone
npm run web
```

This opens the mobile app in your browser with mobile-optimized interface.

## 📊 Build Timeline

- **APK Build**: 10-20 minutes
- **iOS Build**: 15-30 minutes
- **Local Build**: 5-10 minutes (with setup)
- **Expo Go**: Instant (development only)

## 🎯 Recommended Approach

For your immediate needs:

1. **Testing**: Use Expo Go app with QR code
2. **Demo**: Build APK using `expo build:android --type apk`
3. **Production**: Use EAS Build with proper certificates

The mobile app is fully functional and ready for building. All GPS mapping, QR scanning, and offline features will work in the built APK/IPA files.