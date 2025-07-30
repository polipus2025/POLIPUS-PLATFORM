#!/bin/bash

# AgriTrace360™ LACRA Mobile App - APK Build Script
# This script builds a downloadable APK file for Android devices

echo "🚀 Building AgriTrace360™ LACRA Mobile APK..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the mobile-standalone directory"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is required. Please install Node.js and npm"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Login check
echo "🔐 Checking Expo authentication..."
if ! expo whoami &> /dev/null; then
    echo "📝 Please login to Expo:"
    echo "   1. Create account at: https://expo.dev/signup"
    echo "   2. Run: expo login"
    echo "   3. Re-run this script"
    exit 1
fi

# Start APK build
echo "🏗️  Starting APK build process..."
echo "This will take 10-20 minutes. Please wait..."

expo build:android --type apk --no-publish

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ APK build completed successfully!"
    echo "📱 Your APK file is ready for download"
    echo "🔗 Check the download link provided above"
    echo ""
    echo "To install on Android device:"
    echo "1. Download the APK file"
    echo "2. Enable 'Unknown Sources' in Android settings"
    echo "3. Install the APK file"
    echo ""
    echo "📊 App Features:"
    echo "   • GPS Farm Boundary Mapping"
    echo "   • QR Code Commodity Scanning"
    echo "   • Offline Data Storage & Sync"
    echo "   • Multi-Role Authentication"
    echo "   • Real-time Dashboard"
else
    echo "❌ Build failed. Please check the error messages above."
    echo "💡 Common solutions:"
    echo "   • Check internet connection"
    echo "   • Verify Expo account login"
    echo "   • Try: expo build:status"
fi

echo ""
echo "🔍 To check build status: expo build:status"
echo "📱 To test with Expo Go: npm start"