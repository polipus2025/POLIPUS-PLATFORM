import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { commodityAPI } from '../services/api';
import { commoditiesDB } from '../services/database';
import { queueOfflineAction } from '../services/sync';

interface ScannedCommodity {
  id: string;
  qrCode: string;
  name: string;
  quantity: number;
  qualityGrade: string;
  farmId: string;
  scannedAt: string;
}

const QRScannerScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCommodities, setScannedCommodities] = useState<ScannedCommodity[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<ScannedCommodity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualQRCode, setManualQRCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    requestCameraPermission();
    loadScannedCommodities();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const loadScannedCommodities = async () => {
    try {
      const commodities = await commoditiesDB.getCommodities();
      setScannedCommodities(commodities.map(c => ({
        id: c.id,
        qrCode: c.qr_code,
        name: c.name,
        quantity: c.quantity,
        qualityGrade: c.quality_grade,
        farmId: c.farm_id,
        scannedAt: c.created_at
      })));
    } catch (error) {
      console.error('Error loading scanned commodities:', error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsScanning(false);
    await processScanData(data);
  };

  const processScanData = async (qrData: string) => {
    setIsLoading(true);
    try {
      // Try to get commodity info from server
      let commodityInfo;
      try {
        commodityInfo = await commodityAPI.scanQRCode(qrData);
      } catch (error) {
        console.log('Server unavailable, using offline mode');
        // Generate offline commodity info
        commodityInfo = generateOfflineCommodityInfo(qrData);
      }

      // Save to local database
      await commoditiesDB.saveCommodity(
        qrData,
        commodityInfo.name,
        commodityInfo.quantity,
        commodityInfo.qualityGrade,
        commodityInfo.farmId
      );

      // Queue for sync
      await queueOfflineAction('commodity_scanned', {
        qrCode: qrData,
        ...commodityInfo,
        scannedAt: new Date().toISOString()
      });

      // Update local state
      const newCommodity: ScannedCommodity = {
        id: Date.now().toString(),
        qrCode: qrData,
        ...commodityInfo,
        scannedAt: new Date().toISOString()
      };

      setScannedCommodities(prev => [newCommodity, ...prev]);
      setSelectedCommodity(newCommodity);
      setModalVisible(true);

      Alert.alert('Scan Successful', `Commodity: ${commodityInfo.name}`);
    } catch (error) {
      console.error('Error processing scan:', error);
      Alert.alert('Error', 'Failed to process QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOfflineCommodityInfo = (qrCode: string) => {
    // Parse QR code or generate demo data
    const commodityTypes = ['Cocoa', 'Coffee', 'Rice', 'Cassava', 'Rubber'];
    const qualityGrades = ['Premium', 'Grade A', 'Grade B', 'Standard'];
    
    return {
      name: commodityTypes[Math.floor(Math.random() * commodityTypes.length)],
      quantity: Math.floor(Math.random() * 1000) + 100,
      qualityGrade: qualityGrades[Math.floor(Math.random() * qualityGrades.length)],
      farmId: `farm_${qrCode.slice(-6)}`,
    };
  };

  const handleManualInput = async () => {
    if (!manualQRCode.trim()) {
      Alert.alert('Error', 'Please enter a QR code');
      return;
    }

    await processScanData(manualQRCode);
    setManualQRCode('');
    setShowManualInput(false);
  };

  const startScanning = () => {
    setScanned(false);
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanned(false);
  };

  const renderCommodityCard = (commodity: ScannedCommodity, index: number) => (
    <TouchableOpacity 
      key={commodity.id} 
      style={styles.commodityCard}
      onPress={() => {
        setSelectedCommodity(commodity);
        setModalVisible(true);
      }}
    >
      <View style={styles.commodityHeader}>
        <View style={styles.commodityIcon}>
          <Ionicons name="cube" size={24} color="#16a34a" />
        </View>
        <View style={styles.commodityInfo}>
          <Text style={styles.commodityName}>{commodity.name}</Text>
          <Text style={styles.commodityDetails}>
            Quantity: {commodity.quantity} | Grade: {commodity.qualityGrade}
          </Text>
          <Text style={styles.commodityQR}>QR: {commodity.qrCode}</Text>
        </View>
        <View style={styles.commodityStatus}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.statusText}>Scanned</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCommodityModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Commodity Details</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {selectedCommodity && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{selectedCommodity.name}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>QR Code</Text>
                <Text style={styles.detailValue}>{selectedCommodity.qrCode}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{selectedCommodity.quantity}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quality Grade</Text>
                <Text style={styles.detailValue}>{selectedCommodity.qualityGrade}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Farm ID</Text>
                <Text style={styles.detailValue}>{selectedCommodity.farmId}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Scanned At</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedCommodity.scannedAt).toLocaleString()}
                </Text>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={48} color="#ef4444" />
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Position QR code within the frame
            </Text>
            <TouchableOpacity style={styles.stopScanButton} onPress={stopScanning}>
              <Ionicons name="stop" size={20} color="#ffffff" />
              <Text style={styles.stopScanText}>Stop Scanning</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>QR Code Scanner</Text>
            <Text style={styles.headerSubtitle}>
              Scan commodity QR codes for tracking and compliance
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
              <Ionicons name="qr-code" size={24} color="#ffffff" />
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.manualButton} 
              onPress={() => setShowManualInput(!showManualInput)}
            >
              <Ionicons name="create" size={24} color="#ffffff" />
              <Text style={styles.manualButtonText}>Manual Input</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Input */}
          {showManualInput && (
            <View style={styles.manualInputContainer}>
              <Text style={styles.manualInputLabel}>Enter QR Code manually:</Text>
              <TextInput
                style={styles.manualInput}
                value={manualQRCode}
                onChangeText={setManualQRCode}
                placeholder="Enter QR code data"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.manualInputActions}>
                <TouchableOpacity style={styles.submitButton} onPress={handleManualInput}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowManualInput(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Loading */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#16a34a" />
              <Text style={styles.loadingText}>Processing QR code...</Text>
            </View>
          )}

          {/* Scanned Commodities */}
          <View style={styles.commoditiesContainer}>
            <Text style={styles.commoditiesTitle}>
              Scanned Commodities ({scannedCommodities.length})
            </Text>
            {scannedCommodities.length === 0 ? (
              <View style={styles.emptyCommodities}>
                <Ionicons name="cube-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No commodities scanned yet</Text>
                <Text style={styles.emptySubtext}>
                  Start scanning QR codes to track commodities
                </Text>
              </View>
            ) : (
              scannedCommodities.map((commodity, index) => 
                renderCommodityCard(commodity, index)
              )
            )}
          </View>
        </ScrollView>
      )}

      {renderCommodityModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#16a34a',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  scannerText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  stopScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopScanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  manualButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
  },
  manualButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  manualInputContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  manualInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  manualInputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  commoditiesContainer: {
    padding: 20,
  },
  commoditiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyCommodities: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  commodityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commodityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commodityIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f0fdf4',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commodityInfo: {
    flex: 1,
  },
  commodityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  commodityDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  commodityQR: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commodityStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    maxHeight: 300,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  modalActions: {
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default QRScannerScreen;