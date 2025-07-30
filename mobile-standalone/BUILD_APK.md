# AgriTrace360 Mobile APK Build Instructions

## Building Downloadable APK

### Method 1: EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build APK for Android
eas build --platform android --profile preview
```

### Method 2: Local Build with Expo
```bash
# Build APK locally
npx expo build:android --type apk --no-publish

# Or use new build system
npx @expo/cli build:android
```

### Method 3: React Native CLI Build
```bash
# Generate Android project
npx expo eject

# Build with React Native CLI
cd android
./gradlew assembleRelease
```

## APK Distribution Options

### Option A: Direct Download Link
1. Build APK using EAS Build
2. Get download link from Expo dashboard
3. Share link for direct installation

### Option B: Local APK Generation
1. Build APK locally
2. Upload to file sharing service
3. Provide download instructions

### Option C: Progressive Web App (PWA)
1. Configure PWA manifest
2. Enable service worker
3. Users can "Add to Home Screen"

## Installation Instructions for Users

### Android APK Installation:
1. Download APK file
2. Enable "Install from Unknown Sources" in Android settings
3. Tap APK file to install
4. Grant necessary permissions (GPS, Camera, Storage)
5. Launch AgriTrace360 app

### iOS Installation (TestFlight):
1. Build with EAS Build for iOS
2. Upload to TestFlight
3. Send TestFlight invitation
4. Users install via TestFlight app

## App Features in APK
- ✅ Native GPS access for farm boundary mapping
- ✅ Camera integration for QR code scanning
- ✅ Offline data storage and synchronization
- ✅ Multi-role authentication system
- ✅ Real-time LACRA compliance integration
- ✅ Push notifications for alerts
- ✅ Native performance optimization

## Build Configuration

### app.json Configuration:
```json
{
  "expo": {
    "name": "AgriTrace360",
    "slug": "agritrace360-lacra",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.lacra.agritrace360",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.lacra.agritrace360",
      "buildNumber": "1.0.0"
    }
  }
}
```

## Testing APK

### Before Distribution:
1. Test on multiple Android devices
2. Verify GPS functionality works offline
3. Test QR code scanning with device camera
4. Confirm data sync when online
5. Validate all user roles and authentication

### Distribution Checklist:
- [ ] APK signed with release key
- [ ] All permissions properly configured
- [ ] GPS and camera access working
- [ ] Offline functionality tested
- [ ] Data synchronization verified
- [ ] User acceptance testing completed

## Support Information

For APK installation support:
- Minimum Android version: 6.0 (API level 23)
- Recommended: Android 8.0+ for optimal performance
- Required permissions: Location, Camera, Storage
- Network: Works offline with sync when connected
- Storage: ~50MB app size, additional data storage for offline use

The APK provides full native mobile functionality with GPS precision, camera integration, and offline capabilities that web versions cannot match.