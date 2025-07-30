// AgriTrace360™ LACRA Mobile QR Scanner Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const { width, height } = Dimensions.get('window');

// Mock QR Scanner for development
const mockQRScanner = {
  requestPermissions: async () => ({ status: 'granted' }),
  scanQR: async (): Promise<string> => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock QR codes for different commodities
    const mockQRCodes = [
      'COC-LOF-2024-001-QR789456123',
      'COF-NIM-2024-002-QR654321987',
      'RIC-MON-2024-003-QR987654321',
      'RUB-GBA-2024-004-QR456789123',
      'POL-GKR-2024-005-QR321654987',
    ];
    
    return mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
  },
};

interface ScannedData {
  qrCode: string;
  commodity?: any;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface CommodityInfo {
  id: number;
  name: string;
  type: string;
  batchNumber: string;
  county: string;
  qualityGrade: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'compliant' | 'review_required' | 'non_compliant';
  farmerId?: string;
  farmerName?: string;
  harvestDate?: string;
  gpsCoordinates?: string;
}

const QRScannerScreen: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScannedData[]>([]);

  useEffect(() => {
    // Load scan history on component mount
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      // In a real app, this would load from AsyncStorage or API
      const mockHistory: ScannedData[] = [
        {
          qrCode: 'COC-LOF-2024-001-QR789456123',
          timestamp: Date.now() - 3600000, // 1 hour ago
          commodity: {
            name: 'Premium Cocoa Beans',
            type: 'cocoa',
            status: 'compliant',
            farmerName: 'Moses Tuah',
            county: 'Lofa County',
          },
        },
        {
          qrCode: 'COF-NIM-2024-002-QR654321987',
          timestamp: Date.now() - 7200000, // 2 hours ago
          commodity: {
            name: 'Arabica Coffee Beans',
            type: 'coffee',
            status: 'pending',
            farmerName: 'Sarah Konneh',
            county: 'Nimba County',
          },
        },
      ];
      setScanHistory(mockHistory);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const startScanning = async () => {
    try {
      const permission = await mockQRScanner.requestPermissions();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required for QR scanning');
        return;
      }

      setIsScanning(true);
      
      Alert.alert(
        'QR Scanner Active',
        'Point your camera at a commodity QR code',
        [{ text: 'Cancel', onPress: stopScanning }]
      );

      // Simulate scanning process
      const qrCode = await mockQRScanner.scanQR();
      await handleQRScanned(qrCode);
      
    } catch (error) {
      console.error('QR scanning error:', error);
      Alert.alert('Scan Error', 'Failed to scan QR code. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleQRScanned = async (qrCode: string) => {
    try {
      // Get current location for tracking
      const currentLocation = {
        latitude: 6.4281 + (Math.random() - 0.5) * 0.001,
        longitude: -9.4295 + (Math.random() - 0.5) * 0.001,
      };

      // Submit QR scan data to backend
      const scanData = {
        qrCode,
        scannedBy: user?.id || user?.username,
        scannedAt: new Date().toISOString(),
        location: currentLocation,
        userType: user?.userType,
      };

      const response = await apiService.submitQRScan(scanData);
      
      if (response.success) {
        // Mock commodity info based on QR code
        const mockCommodity: CommodityInfo = {
          id: Math.floor(Math.random() * 1000),
          name: qrCode.startsWith('COC') ? 'Premium Cocoa Beans' :
                qrCode.startsWith('COF') ? 'Arabica Coffee Beans' :
                qrCode.startsWith('RIC') ? 'Premium Rice' :
                qrCode.startsWith('RUB') ? 'Natural Rubber' :
                'Palm Oil',
          type: qrCode.substring(0, 3).toLowerCase(),
          batchNumber: qrCode,
          county: qrCode.includes('LOF') ? 'Lofa County' :
                  qrCode.includes('NIM') ? 'Nimba County' :
                  qrCode.includes('MON') ? 'Montserrado County' :
                  qrCode.includes('GBA') ? 'Grand Bassa County' :
                  'Grand Kru County',
          qualityGrade: 'Grade A',
          quantity: 50 + Math.floor(Math.random() * 200),
          unit: 'kg',
          status: Math.random() > 0.3 ? 'compliant' : 'pending',
          farmerId: qrCode.includes('LOF') ? 'FRM-2024-001' : 'FRM-2024-002',
          farmerName: qrCode.includes('LOF') ? 'Moses Tuah' : 'Sarah Konneh',
          harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          gpsCoordinates: `${currentLocation.latitude},${currentLocation.longitude}`,
        };

        const newScanData: ScannedData = {
          qrCode,
          commodity: mockCommodity,
          timestamp: Date.now(),
          location: currentLocation,
        };

        setScannedData(newScanData);
        setScanHistory(prev => [newScanData, ...prev]);
        setShowResult(true);

        // Show success message
        Alert.alert(
          'QR Code Scanned',
          `Successfully scanned: ${qrCode}\nCommodity: ${mockCommodity.name}`,
          [{ text: 'View Details', onPress: () => setShowResult(true) }]
        );
      } else {
        throw new Error(response.error || 'Failed to submit scan data');
      }
    } catch (error) {
      console.error('Error processing QR scan:', error);
      Alert.alert('Processing Error', 'Failed to process QR code. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'review_required': return '#ef4444';
      case 'non_compliant': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'compliant': return 'Compliant ✓';
      case 'pending': return 'Pending Review';
      case 'review_required': return 'Review Required';
      case 'non_compliant': return 'Non-Compliant';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>
          Scan commodity QR codes for tracking and verification
        </Text>
      </View>

      {/* Scanner Controls */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerArea}>
          <View style={styles.scannerFrame}>
            <Text style={styles.scannerText}>
              {isScanning ? '📱 Scanning...' : '📱 Ready to Scan'}
            </Text>
            <Text style={styles.scannerInstructions}>
              {isScanning ? 
                'Point camera at QR code' : 
                'Tap the button below to start scanning'
              }
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={isScanning ? stopScanning : startScanning}
          disabled={isScanning}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? '⏹️ Stop Scanning' : '📷 Start Scanning'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Scans */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Scans</Text>
        {scanHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No QR codes scanned yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Scan your first commodity QR code to get started
            </Text>
          </View>
        ) : (
          scanHistory.map((scan, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => {
                setScannedData(scan);
                setShowResult(true);
              }}
            >
              <View style={styles.historyItemContent}>
                <Text style={styles.historyItemTitle}>
                  {scan.commodity?.name || 'Unknown Commodity'}
                </Text>
                <Text style={styles.historyItemSubtitle}>
                  {scan.qrCode}
                </Text>
                <View style={styles.historyItemMeta}>
                  <Text style={styles.historyItemTime}>
                    {formatTimestamp(scan.timestamp)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(scan.commodity?.status || 'unknown') }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(scan.commodity?.status || 'unknown')}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Scan Result Modal */}
      <Modal
        visible={showResult}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResult(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Scan Result</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowResult(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {scannedData && (
                <View style={styles.resultContent}>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>QR Code</Text>
                    <Text style={styles.resultValue}>{scannedData.qrCode}</Text>
                  </View>

                  {scannedData.commodity && (
                    <>
                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Commodity</Text>
                        <Text style={styles.resultValue}>{scannedData.commodity.name}</Text>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Type</Text>
                        <Text style={styles.resultValue}>
                          {scannedData.commodity.type.toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Status</Text>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(scannedData.commodity.status) }
                        ]}>
                          <Text style={styles.statusBadgeText}>
                            {getStatusText(scannedData.commodity.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Farmer</Text>
                        <Text style={styles.resultValue}>
                          {scannedData.commodity.farmerName} ({scannedData.commodity.farmerId})
                        </Text>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>County</Text>
                        <Text style={styles.resultValue}>{scannedData.commodity.county}</Text>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Quantity</Text>
                        <Text style={styles.resultValue}>
                          {scannedData.commodity.quantity} {scannedData.commodity.unit}
                        </Text>
                      </View>

                      <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Quality Grade</Text>
                        <Text style={styles.resultValue}>{scannedData.commodity.qualityGrade}</Text>
                      </View>
                    </>
                  )}

                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Scanned At</Text>
                    <Text style={styles.resultValue}>
                      {new Date(scannedData.timestamp).toLocaleString()}
                    </Text>
                  </View>

                  {scannedData.location && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultLabel}>Location</Text>
                      <Text style={styles.resultValue}>
                        {scannedData.location.latitude.toFixed(6)}, {scannedData.location.longitude.toFixed(6)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#f59e0b',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fef3c7',
    marginTop: 4,
  },
  scannerContainer: {
    margin: 16,
  },
  scannerArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannerFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 12,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerText: {
    fontSize: 24,
    marginBottom: 8,
  },
  scannerInstructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonActive: {
    backgroundColor: '#ef4444',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    margin: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItemContent: {
    gap: 8,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  historyItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  historyItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  resultContent: {
    gap: 16,
  },
  resultSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: '#1f2937',
  },
});

export default QRScannerScreen;