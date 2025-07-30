# AgriTrace360™ LACRA Mobile Application

A comprehensive React Native mobile application for the Liberia Agriculture Commodity Regulatory Authority (LACRA) agricultural commodity compliance management system.

## Overview

This standalone mobile application provides field workers, farmers, regulatory staff, and exporters with comprehensive tools for agricultural compliance monitoring, GPS mapping, QR code scanning, and offline data synchronization.

## Features

### 🎯 Core Functionality
- **Multi-Role Authentication**: Farmer, Field Agent, Regulatory Staff, and Exporter portals
- **GPS Field Mapping**: Precision boundary mapping with real-time GPS coordinates
- **QR Code Scanner**: Commodity tracking through barcode scanning
- **Offline Sync**: Work without internet, sync when connected
- **Real-time Dashboard**: Live statistics and activity monitoring

### 📱 Mobile-Optimized Features
- **Native GPS Integration**: Using Expo Location for precise positioning
- **Camera Integration**: Built-in QR/barcode scanner with Expo Camera
- **Offline Database**: SQLite local storage for offline functionality
- **Push Notifications**: Real-time alerts and updates
- **Responsive Design**: Optimized for mobile devices

### 🌐 Platform Integration
- **API Connectivity**: Full integration with main AgriTrace360™ platform
- **Data Synchronization**: Bidirectional sync with web platform
- **Authentication**: JWT token-based security
- **Real-time Updates**: Live data synchronization when online

## Technical Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation and routing
- **Expo Vector Icons**: Comprehensive icon library

### Data & Storage
- **SQLite**: Local database for offline functionality
- **AsyncStorage**: Secure local data storage
- **Axios**: HTTP client for API communication
- **Real-time Sync**: Background data synchronization

### Location & Camera
- **Expo Location**: GPS and location services
- **Expo Camera**: Camera and barcode scanning
- **React Native Maps**: Interactive mapping components
- **Expo Barcode Scanner**: QR/barcode scanning capabilities

## Project Structure

```
mobile-standalone/
├── src/
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── GPSMappingScreen.tsx
│   │   ├── QRScannerScreen.tsx
│   │   ├── OfflineSyncScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── services/          # Business logic and API
│       ├── api.ts         # Main platform API integration
│       ├── database.ts    # Local SQLite operations
│       └── sync.ts        # Data synchronization logic
├── App.tsx               # Main application component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-standalone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the `API_BASE_URL` in `src/services/api.ts` to point to your main platform:
   ```typescript
   const API_BASE_URL = 'https://your-platform-url.com/api';
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/simulator**
   - For Android: `npm run android` or scan QR code with Expo Go
   - For iOS: `npm run ios` or scan QR code with Expo Go
   - For web: `npm run web`

## Usage

### Authentication
The app supports four user types:
- **Farmer**: Farm management and GPS mapping
- **Field Agent**: Inspections and compliance monitoring
- **Regulatory Staff**: Full administrative access
- **Exporter**: Export compliance and documentation

### Demo Credentials
For testing purposes, use:
- **Username**: `demo`
- **Password**: `demo`
- **User Type**: Any role

### GPS Mapping Workflow
1. Navigate to "GPS Mapping" tab
2. Tap "Start Recording" to begin boundary mapping
3. Walk around farm boundary and tap "Add Point" at each corner
4. Tap "Stop Recording" when complete
5. Review boundary and tap "Save Boundary"

### QR Code Scanning
1. Navigate to "QR Scanner" tab
2. Tap "Start Scanning" to activate camera
3. Position QR code within the frame
4. View scanned commodity details
5. Data automatically syncs when online

### Offline Functionality
- All features work offline
- Data stored locally in SQLite database
- Automatic sync when internet connection restored
- View pending actions in "Sync" tab

## API Integration

The mobile app integrates with the main AgriTrace360™ platform through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/{role}-login` - User authentication
- `GET /api/auth/user` - Get current user info

### GPS & Mapping Endpoints
- `POST /api/gps/boundaries` - Save farm boundaries
- `GET /api/gps/boundaries` - Retrieve boundaries
- `POST /api/gps/points` - Save GPS points

### Commodity Endpoints
- `POST /api/commodities/scan` - Process QR code scan
- `GET /api/commodities` - Get commodity list
- `PATCH /api/commodities/{id}` - Update commodity

### Sync Endpoints
- `POST /api/sync/upload` - Upload offline data
- `GET /api/sync/download` - Download updates
- `GET /api/health` - Check connectivity

## Development

### Adding New Screens
1. Create new screen component in `src/screens/`
2. Add navigation route in `App.tsx`
3. Update tab navigator if needed
4. Add appropriate icons and styling

### Database Schema
The app uses SQLite for local storage with these main tables:
- `gps_boundaries` - Farm boundary data
- `gps_points` - Individual GPS coordinates
- `commodities` - Scanned commodity information
- `offline_queue` - Pending sync actions
- `user_cache` - Cached user data

### Offline Sync Strategy
1. **Data Collection**: Store all actions locally first
2. **Queue Management**: Add actions to offline queue
3. **Background Sync**: Attempt sync when online
4. **Conflict Resolution**: Handle data conflicts gracefully
5. **Retry Logic**: Automatic retry for failed syncs

## Build & Deployment

### Development Build
```bash
expo build:android --type apk
expo build:ios --type simulator
```

### Production Build
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

### App Store Deployment
1. Configure app.json with proper metadata
2. Build production bundles
3. Submit to Google Play Store / Apple App Store
4. Configure proper certificates and provisioning profiles

## Configuration

### Environment Variables
- `API_BASE_URL`: Main platform API endpoint
- `APP_VERSION`: Application version number
- `BUILD_NUMBER`: Build identifier

### Permissions Required
- **Location**: GPS mapping and boundary tracking
- **Camera**: QR code and barcode scanning
- **Storage**: Local data and cache management
- **Network**: API communication and sync

## Troubleshooting

### Common Issues

**GPS not working:**
- Ensure location permissions granted
- Check device GPS settings
- Verify Expo Location integration

**QR Scanner not working:**
- Check camera permissions
- Ensure adequate lighting
- Verify barcode scanner setup

**Sync failures:**
- Check network connectivity
- Verify API endpoint configuration
- Review authentication tokens

**App crashes:**
- Check console logs for errors
- Verify all dependencies installed
- Test on different devices/simulators

## Support

For technical support and bug reports:
- Email: support@lacra.gov.lr
- Platform: AgriTrace360™ LACRA
- Documentation: [Platform documentation URL]

## License

© 2025 LACRA - Liberia Agriculture Commodity Regulatory Authority. All rights reserved.

This mobile application is part of the AgriTrace360™ agricultural compliance management system.