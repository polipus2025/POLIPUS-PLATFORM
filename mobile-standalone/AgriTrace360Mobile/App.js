import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>AgriTrace360</Text>
        <Text style={styles.subtitle}>LACRA Platform</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🌾</Text>
          <Text style={styles.cardTitle}>Farm Dashboard</Text>
          <Text style={styles.stat}>127 Farms</Text>
          <Text style={styles.stat}>94% Compliance</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.cardTitle}>GPS Mapping</Text>
          <Text style={styles.stat}>Active</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.cardTitle}>QR Scanner</Text>
          <Text style={styles.stat}>Ready</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>LACRA Agricultural Compliance</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stat: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});