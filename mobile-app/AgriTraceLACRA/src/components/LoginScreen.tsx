// AgriTrace360™ LACRA Mobile Login Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types';

const LACRA_LOGO = require('../../assets/lacra-logo.png'); // Add LACRA logo to assets

const LoginScreen: React.FC = () => {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    userType: 'farmer',
    county: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const result = await login(credentials);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  const handleUserTypeChange = (userType: LoginCredentials['userType']) => {
    setCredentials(prev => ({ ...prev, userType }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with LACRA Logo */}
        <View style={styles.header}>
          <Image source={LACRA_LOGO} style={styles.logo} />
          <Text style={styles.title}>AgriTrace360™</Text>
          <Text style={styles.subtitle}>LACRA Mobile Portal</Text>
          <Text style={styles.description}>
            Liberia Agriculture Commodity Regulatory Authority
          </Text>
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeLabel}>Select Portal</Text>
          <View style={styles.userTypeButtons}>
            {[
              { key: 'farmer', label: 'Farmer', color: '#22c55e' },
              { key: 'field_agent', label: 'Field Agent', color: '#f59e0b' },
              { key: 'regulatory', label: 'Regulatory', color: '#3b82f6' },
              { key: 'exporter', label: 'Exporter', color: '#8b5cf6' },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.userTypeButton,
                  { backgroundColor: credentials.userType === type.key ? type.color : '#f3f4f6' }
                ]}
                onPress={() => handleUserTypeChange(type.key as LoginCredentials['userType'])}
              >
                <Text
                  style={[
                    styles.userTypeButtonText,
                    { color: credentials.userType === type.key ? '#fff' : '#374151' }
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {credentials.userType === 'farmer' ? 'Farmer ID' : 
               credentials.userType === 'field_agent' ? 'Agent ID' : 
               'Username'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                credentials.userType === 'farmer' ? 'e.g., FRM-2024-001' :
                credentials.userType === 'field_agent' ? 'e.g., AGT-2024-001' :
                credentials.userType === 'exporter' ? 'e.g., EXP-2024-001' :
                'admin001'
              }
              value={credentials.username}
              onChangeText={(text) => setCredentials(prev => ({ ...prev, username: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                value={credentials.password}
                onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Optional County Field for Farmers and Field Agents */}
          {(credentials.userType === 'farmer' || credentials.userType === 'field_agent') && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {credentials.userType === 'farmer' ? 'County (Optional)' : 'Jurisdiction (Optional)'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Select county (optional)"
                value={credentials.county}
                onChangeText={(text) => setCredentials(prev => ({ ...prev, county: text }))}
              />
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure access to agricultural compliance management
          </Text>
          <Text style={styles.versionText}>AgriTrace360™ Mobile v1.0</Text>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  userTypeContainer: {
    marginBottom: 30,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  passwordToggleText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#9ca3af',
  },
});

export default LoginScreen;