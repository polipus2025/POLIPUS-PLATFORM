# 📱 AgriTrace360 Mobile - Expo Go Setup

## 🎯 Quick Setup for Expo Go Testing

Since the shell commands in Replit aren't working properly, here's a direct approach:

### Step 1: Install Expo Go on Your Phone
- **Android**: Download "Expo Go" from Google Play Store
- **iPhone**: Download "Expo Go" from Apple App Store

### Step 2: Use Replit's Web Terminal
1. At the **bottom of your Replit screen**, look for tabs
2. Click **"Shell"** tab (if not visible, click "+" to add new shell)
3. **Copy and paste this single command**:

```bash
cd mobile-standalone && npm install @react-native-async-storage/async-storage@1.21.0 expo@50.0.0 react@18.2.0 react-native@0.73.0 --legacy-peer-deps && npx expo start --tunnel
```

### Step 3: Scan QR Code
- The terminal will show a QR code
- Open **Expo Go app** on your phone
- **Scan the QR code**
- Your mobile app will load instantly!

## 🔧 Alternative: Direct Web Access

If terminal still doesn't work, use the web mobile demo:
**http://localhost:5000/mobile-demo**

## 📱 What Your Mobile App Includes

✅ **Multi-role Login**: Farmer, Field Agent, LACRA Staff, Exporter portals
✅ **GPS Farm Mapping**: Real-time boundary mapping with Liberian coordinates  
✅ **QR Code Scanner**: Commodity tracking and verification
✅ **Offline Data Sync**: Works without internet, syncs when online
✅ **LACRA Integration**: Direct connection to regulatory platform
✅ **Agricultural Tools**: Crop planning, compliance tracking, export permits

## 🎯 Troubleshooting

**If QR code doesn't appear:**
- Make sure you're in the mobile-standalone folder: `cd mobile-standalone`
- Try: `npx expo start --web` for browser testing
- Use the web demo at `/mobile-demo` as backup

**If Expo Go shows errors:**
- Close and reopen Expo Go app
- Make sure your phone and computer are on same network
- Try refreshing by pulling down in Expo Go

Your mobile app is ready - it just needs the right terminal access method!