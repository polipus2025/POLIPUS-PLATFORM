import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { authAPI } from '../services/api';

interface LoginScreenProps {
  onLogin: (authToken: string, userType: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(username, password, userType);
      
      if (response.success) {
        await onLogin(response.token, userType);
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Connection Error', 
        'Unable to connect to server. Working in offline mode.'
      );
      // Allow offline login with demo credentials
      if (username === 'demo' && password === 'demo') {
        await onLogin('demo-token', userType);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>📱</Text>
          </View>
          <Text style={styles.title}>AgriTrace360™</Text>
          <Text style={styles.subtitle}>LACRA Mobile App</Text>
          <Text style={styles.description}>
            Agricultural Commodity Compliance Management System
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login to Continue</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Farmer" value="farmer" />
                <Picker.Item label="Field Agent" value="field_agent" />
                <Picker.Item label="Regulatory Staff" value="regulatory" />
                <Picker.Item label="Exporter" value="exporter" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Username: demo | Password: demo</Text>
            <Text style={styles.demoNote}>
              (Works offline for testing purposes)
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 LACRA - Liberia Agriculture Commodity Regulatory Authority
          </Text>
          <Text style={styles.versionText}>Mobile App v1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#16a34a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
  },
  loginButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  demoNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#9ca3af',
  },
});

export default LoginScreen;