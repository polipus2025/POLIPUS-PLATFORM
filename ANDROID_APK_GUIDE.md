# AgriTrace360 Android APK Creation Guide

## Overview
This guide will help you create an Android APK for the AgriTrace360 LACRA platform using Android Studio with a WebView approach.

## Prerequisites
1. **Android Studio** (Latest version)
2. **Java Development Kit (JDK)** 8 or higher
3. **Android SDK** (automatically installed with Android Studio)
4. **Your AgriTrace360 platform** running on a publicly accessible URL

## Step 1: Install Android Studio

1. Download Android Studio from: https://developer.android.com/studio
2. Install with default settings
3. Launch Android Studio and complete the setup wizard
4. Install required SDK components when prompted

## Step 2: Create New Android Project

1. Open Android Studio
2. Click "Create New Project"
3. Select "Empty Activity"
4. Configure your project:
   - **Application name**: AgriTrace360 LACRA
   - **Package name**: com.lacra.agritrace360
   - **Save location**: Choose your preferred directory
   - **Language**: Java
   - **Minimum SDK**: API 21 (Android 5.0)
5. Click "Finish"

## Step 3: Configure App Permissions

Edit `app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.lacra.agritrace360">

    <!-- Internet permission for WebView -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- GPS permissions for location features -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <!-- Camera permission for QR scanning -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Storage permissions -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.AgriTrace360"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## Step 4: Update MainActivity.java

Replace the content of `app/src/main/java/com/lacra/agritrace360/MainActivity.java`:

```java
package com.lacra.agritrace360;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final int PERMISSION_REQUEST_CODE = 1;
    
    // Your AgriTrace360 platform URL
    private static final String PLATFORM_URL = "https://your-replit-domain.replit.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView
        webView = findViewById(R.id.webview);
        
        // Request permissions
        requestPermissions();
        
        // Configure WebView
        setupWebView();
        
        // Load the AgriTrace360 platform
        webView.loadUrl(PLATFORM_URL);
    }

    private void requestPermissions() {
        String[] permissions = {
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.CAMERA,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
        };

        boolean needPermission = false;
        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(this, permission) 
                != PackageManager.PERMISSION_GRANTED) {
                needPermission = true;
                break;
            }
        }

        if (needPermission) {
            ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQUEST_CODE);
        }
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable local storage
        webSettings.setDomStorageEnabled(true);
        
        // Enable geolocation
        webSettings.setGeolocationEnabled(true);
        
        // Enable file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Enable zoom controls
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Set user agent
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " AgriTrace360App");
        
        // Set WebView client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        // Set WebChrome client for geolocation
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, 
                GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allPermissionsGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allPermissionsGranted = false;
                    break;
                }
            }
            
            if (!allPermissionsGranted) {
                Toast.makeText(this, "Some permissions were denied. App may not work properly.", 
                    Toast.LENGTH_LONG).show();
            }
        }
    }
}
```

## Step 5: Update Layout File

Replace the content of `app/src/main/res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</RelativeLayout>
```

## Step 6: Update App Strings

Edit `app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">AgriTrace360 LACRA</string>
</resources>
```

## Step 7: Configure App Icon (Optional)

1. Right-click on `app/src/main/res` in Project Explorer
2. Select "New" > "Image Asset"
3. Choose "Launcher Icons (Adaptive and Legacy)"
4. Upload your LACRA logo or AgriTrace360 logo
5. Configure the icon settings
6. Click "Next" and "Finish"

## Step 8: Update Platform URL

**IMPORTANT**: Replace the `PLATFORM_URL` in MainActivity.java with your actual deployed URL:

```java
// Replace this with your actual Replit deployment URL
private static final String PLATFORM_URL = "https://your-actual-replit-domain.replit.app";
```

## Step 9: Build the APK

1. In Android Studio, go to "Build" menu
2. Select "Build Bundle(s) / APK(s)" > "Build APK(s)"
3. Wait for the build to complete
4. Click "locate" in the build notification to find your APK file

## Step 10: Test the APK

1. Enable "Developer Options" on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable "USB Debugging" in Developer Options
3. Connect your device to your computer
4. Install the APK using ADB or file transfer

## Alternative: Generate Signed APK for Play Store

1. Go to "Build" > "Generate Signed Bundle / APK"
2. Select "APK"
3. Create a new keystore or use existing one
4. Fill in the keystore details
5. Choose "release" build variant
6. Click "Finish"

## Required Information for Your App

Here's the key information you'll need to configure:

### App Details
- **App Name**: AgriTrace360 LACRA
- **Package Name**: com.lacra.agritrace360
- **Version Code**: 1
- **Version Name**: 1.0.0

### Platform URL
You'll need to replace `PLATFORM_URL` with your actual deployed Replit URL. Based on your current setup, it should be something like:
- `https://your-replit-username-workspace-name.replit.app`

### Permissions Needed
- Internet access (for web platform)
- Location access (for GPS mapping)
- Camera access (for QR scanning)
- Storage access (for file downloads)

## Troubleshooting

### Common Issues:

1. **Network Security Error**: Add `android:usesCleartextTraffic="true"` to manifest
2. **GPS Not Working**: Ensure location permissions are granted
3. **WebView Not Loading**: Check internet connection and URL accessibility
4. **Build Errors**: Ensure all required SDKs are installed

### Testing Checklist:
- [ ] App installs successfully
- [ ] Platform loads correctly
- [ ] Login portals work
- [ ] GPS features function
- [ ] Mobile interface is responsive
- [ ] All authentication flows work

## Next Steps

1. Test the APK thoroughly on different devices
2. Consider publishing to Google Play Store
3. Implement push notifications (if needed)
4. Add offline capabilities (if required)
5. Implement app updates mechanism

This guide creates a native Android wrapper around your existing web platform, allowing users to access AgriTrace360 as a mobile app while maintaining all the functionality of your web platform.