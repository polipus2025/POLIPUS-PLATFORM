# AgriTrace360 Mobile App - Quick Access Guide

## 📱 IMMEDIATE ACCESS OPTIONS

### Option 1: QR Code Scanning (Expo Go)
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ ██▀▀ ▀▄██ ▄▄▄▄▄ █
█ █   █ █  ▀█ ▀█▄▄█ █   █ █
█ █▄▄▄█ █▀  █▄▀▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄█ ▀▄█▄█ █▄▄▄▄▄▄▄█
█ ▄▀█ ▄▄▀▀█▄█▄▀▄ ▄██ ▀▄▄ ▄█
█▀   █▀▄▀█ ▄█▀▄▀ ▀▀  ▄  ▀██
█ ▄▀█▄▄▄▄ █▀▄▀▄ ▀▄▀▄▀▀▄ ▀██
████▀  ▄▄ ▄  ▄ ▄▄▄ ██▄ ▀███
█▄▄████▄█  ▀█▄ ▀▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀▀██▀█▀▀ █▄█ ▀▀▀██
█ █   █ █▄▀█▄▀▄▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀▄█ ▄ ▄▄▄▄ ▀█▀▀ ██
█▄▄▄▄▄▄▄█▄▄██▄▄█████▄▄▄▄▄▄█
```

**Expo URL:** `exp://127.0.0.1:8083`

**How to Use:**
1. Install Expo Go from Google Play Store or App Store
2. Scan the QR code above OR paste the URL
3. App opens directly with full functionality

### Option 2: Web Browser Mobile Access
- **Mobile Preview:** http://localhost:5000/mobile-app-working.html
- **Mobile Simulator:** http://localhost:5000/mobile-app-simulator
- **Mobile Demo:** http://localhost:5000/mobile-demo

### Option 3: Android APK Download (Native App)
- **Build Status:** Ready for generation
- **Package:** com.lacra.agritrace360
- **Features:** Native GPS, Camera, Offline storage
- **Installation:** Direct APK installation (no Play Store needed)

## 🚀 CURRENT SERVER STATUS

### Expo Development Server
- **Status:** ✅ Running
- **Port:** 8083
- **Metro Bundler:** Active
- **Platform Support:** iOS & Android

### APK Build System
- **EAS CLI:** ✅ Installed
- **Build Profile:** ✅ Configured
- **Android Package:** ✅ Ready
- **Build Command:** `npx eas build --platform android --profile preview`

## 📋 APP FEATURES AVAILABLE

### Multi-Role Authentication
- ✅ Farmer Portal
- ✅ Field Agent Portal  
- ✅ LACRA Staff Portal
- ✅ Exporter Portal

### GPS & Mapping
- ✅ Real-time GPS tracking
- ✅ Farm boundary mapping
- ✅ Liberian coordinate system
- ✅ Offline GPS functionality

### Data Management
- ✅ QR code scanning
- ✅ Offline data storage
- ✅ Real-time synchronization
- ✅ LACRA compliance integration

### Mobile Features
- ✅ Touch-optimized interface
- ✅ Camera integration
- ✅ Push notifications
- ✅ Offline capabilities

## ⚡ QUICK START COMMANDS

### Start Mobile Server
```bash
cd mobile-standalone/AgriTrace360Mobile
npx expo start --localhost --port 8083
```

### Build APK
```bash
cd mobile-standalone/AgriTrace360Mobile
npx eas build --platform android --profile preview
```

### Access Mobile Preview
Visit: http://localhost:5000/mobile-app-working.html

## 📱 TEST CREDENTIALS

Use these credentials in the mobile app:

### Farmer Portal
- **Username:** FRM-2024-001
- **Password:** farmer123

### Field Agent Portal  
- **Username:** AGT-2024-001
- **Password:** agent123

### LACRA Staff Portal
- **Username:** admin001
- **Password:** admin123

### Exporter Portal
- **Username:** EXP-2024-001
- **Password:** exporter123

## 🔧 TECHNICAL DETAILS

### System Requirements
- **Android:** 6.0+ (API 23)
- **iOS:** 11.0+
- **Expo Go:** Latest version
- **Network:** WiFi or Mobile Data (optional for offline features)

### Permissions Required
- **Location:** GPS farm mapping
- **Camera:** QR code scanning
- **Storage:** Offline data
- **Network:** Data synchronization

Your AgriTrace360 mobile app is fully operational and ready for testing with both Expo Go and native APK options available.