#!/bin/bash

echo "🚀 Starting AgriTrace360 Mobile App Setup..."

# Navigate to mobile directory
cd mobile-standalone

echo "📂 Current directory: $(pwd)"

# Check if we can use Expo CLI
if command -v npx &> /dev/null; then
    echo "✅ NPX found, initializing Expo project..."
    
    # Initialize Expo project
    npx create-expo-app@latest temp-app --template blank-typescript --yes
    
    # Copy files to current directory
    cp -r temp-app/* .
    cp temp-app/.* . 2>/dev/null || true
    rm -rf temp-app
    
    echo "📱 Installing mobile dependencies..."
    npx expo install expo-location expo-camera expo-barcode-scanner @react-navigation/native @react-navigation/stack expo-sqlite
    
    echo "🌐 Starting Expo development server with tunnel..."
    npx expo start --tunnel
else
    echo "❌ NPX not found. Please try:"
    echo "1. Go to your Replit Shell tab"
    echo "2. Type: cd mobile-standalone"
    echo "3. Type: npx expo start --web"
fi