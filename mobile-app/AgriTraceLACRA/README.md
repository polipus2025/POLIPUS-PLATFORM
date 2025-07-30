# AgriTrace360™ LACRA Mobile App

A comprehensive mobile application for the Liberia Agriculture Commodity Regulatory Authority (LACRA) agricultural traceability and compliance platform.

## Overview

The AgriTrace360™ LACRA Mobile App provides field-ready access to agricultural compliance management, GPS mapping, commodity tracking, and real-time data collection for farmers, field agents, regulatory staff, and exporters in Liberia.

## Key Features

### 🌾 **Multi-Role Authentication**
- **Farmers**: Access farm management and commodity registration
- **Field Agents**: Conduct inspections and data collection
- **Regulatory Staff**: Compliance monitoring and oversight
- **Exporters**: Export permit management and documentation

### 📍 **GPS Field Mapping**
- Precision boundary mapping with GPS coordinates
- Real-time location tracking and satellite connectivity
- Automatic area calculation in hectares
- Offline mapping capabilities for remote areas

### 📱 **QR Code Scanning**
- Commodity tracking through QR code scanning
- Batch number verification and traceability
- Real-time data synchronization with LACRA systems

### 🗺️ **Offline Functionality**
- Work without internet connectivity
- Local data storage and sync when connected
- Essential for remote agricultural areas

### 📊 **Real-Time Dashboard**
- Live compliance metrics and statistics
- User-specific quick actions and features
- Activity tracking and notifications

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Location Services**: Expo Location
- **Camera/Scanner**: Expo Camera & Barcode Scanner
- **Storage**: AsyncStorage for local data
- **API Integration**: RESTful API with JWT authentication

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio (for emulators)
- Physical device with Expo Go app (recommended for GPS testing)

### Development Setup
```bash
# Navigate to mobile app directory
cd mobile-app/AgriTraceLACRA

# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Backend Integration
The mobile app connects to the AgriTrace360™ LACRA backend server:
- **Development**: `http://localhost:5000/api`
- **Production**: Update `API_BASE_URL` in `src/services/api.ts`

## App Architecture

### Directory Structure
```
src/
├── components/          # React Native screens
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   └── GPSMappingScreen.tsx
├── contexts/            # React Context providers
│   └── AuthContext.tsx
├── services/            # API and external services
│   └── api.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

### Authentication Flow
1. User selects portal type (Farmer/Field Agent/Regulatory/Exporter)
2. Enters credentials (ID/username and password)
3. Optional county/jurisdiction selection
4. JWT token storage for subsequent API calls
5. Role-based navigation and feature access

### GPS Mapping Workflow
1. Initialize GPS and request location permissions
2. Wait for satellite connectivity (10+ satellites)
3. Walk field perimeter and record boundary points
4. Calculate area using GPS coordinates
5. Save plot data with metadata to LACRA backend

## User Portals

### 👨‍🌾 **Farmer Portal**
- **GPS Field Mapping**: Map farm boundaries with GPS precision
- **Commodity Registration**: Register harvest commodities
- **Farm Plot Management**: View and manage registered plots
- **Compliance Status**: Track compliance metrics

### 👨‍💻 **Field Agent Portal**
- **QR Code Scanner**: Scan commodity QR codes for tracking
- **Field Inspections**: Conduct and record inspections
- **Data Collection**: Submit field reports to LACRA
- **Territory Management**: Access assigned jurisdiction data

### 🏛️ **Regulatory Portal**
- **Compliance Dashboard**: Monitor compliance metrics
- **Inspection Records**: Review field agent reports
- **Certificate Management**: Issue compliance certificates
- **Alert Management**: Handle system notifications

### 🚢 **Exporter Portal**
- **Export Permits**: Manage permit applications
- **EUDR Compliance**: Track deforestation compliance
- **Document Verification**: Verify export documentation
- **Shipment Tracking**: Monitor export shipments

## API Integration

### Authentication Endpoints
- `POST /api/auth/farmer-login`
- `POST /api/auth/field-agent-login`
- `POST /api/auth/regulatory-login`
- `POST /api/auth/exporter-login`
- `POST /api/auth/logout`

### Core Data Endpoints
- `GET/POST /api/commodities`
- `GET/POST /api/farm-plots`
- `GET/POST /api/inspections`
- `GET/POST /api/alerts`
- `POST /api/gps-tracking`
- `POST /api/qr-scans`

### Dashboard & Metrics
- `GET /api/dashboard/metrics`
- `GET /api/messages/{userId}`
- `POST /api/messages`

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- React Native best practices
- Expo development workflows
- Consistent styling with StyleSheet

### Testing
- Test on physical devices for GPS accuracy
- Verify offline functionality in poor connectivity areas
- Cross-platform testing (iOS/Android)
- API integration testing with backend

### Performance Optimization
- Lazy loading for screens
- Optimized GPS tracking intervals
- Efficient AsyncStorage usage
- Image compression for photos

## Security Features

- JWT token-based authentication
- Secure API communication (HTTPS in production)
- Local data encryption
- Permission-based feature access
- Audit trail for all actions

## Deployment

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas login
eas build:configure

# Build for production
eas build --platform all
```

### Distribution
- **Internal Testing**: Expo Go app with QR code
- **TestFlight (iOS)**: EAS Build + TestFlight distribution
- **Google Play (Android)**: EAS Build + Play Console upload
- **Enterprise Distribution**: LACRA internal distribution

## Permissions Required

### iOS
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`
- `NSCameraUsageDescription`

### Android
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `CAMERA`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

## Integration with Web Platform

The mobile app seamlessly integrates with the AgriTrace360™ LACRA web platform:
- Shared backend API and database
- Real-time data synchronization
- Cross-platform user accounts
- Unified compliance tracking
- Consistent branding and UX

## Support & Maintenance

### Version Control
- Semantic versioning (v1.0.0)
- Feature branches for development
- Production releases through EAS

### Monitoring
- Crash reporting with Expo tools
- Performance monitoring
- User analytics and usage tracking
- API response time monitoring

## Future Enhancements

- **Offline Maps**: Full offline mapping capability
- **IoT Integration**: Sensor data collection
- **Machine Learning**: Crop disease detection
- **Blockchain**: Supply chain transparency
- **Multi-language**: Local language support
- **Voice Commands**: Hands-free operation

## Contact & Support

For technical support and development inquiries:
- **LACRA Technical Team**: Support for regulatory and compliance issues
- **Development Team**: Technical implementation and API integration
- **Field Support**: On-site training and user assistance

---

**AgriTrace360™ LACRA Mobile** - Empowering Liberian agriculture through mobile technology and precision compliance management.