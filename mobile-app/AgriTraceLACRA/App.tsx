// AgriTrace360™ LACRA Mobile App Main Entry Point
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

// Context Providers
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Screens
import LoginScreen from './src/components/LoginScreen';
import DashboardScreen from './src/components/DashboardScreen';
import GPSMappingScreen from './src/components/GPSMappingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Add loading spinner here */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#22c55e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ 
                title: 'AgriTrace360™ LACRA',
                headerLeft: () => null, // Disable back button
              }}
            />
            <Stack.Screen 
              name="GPSMapping" 
              component={GPSMappingScreen}
              options={{ title: 'GPS Field Mapping' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#22c55e" />
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});