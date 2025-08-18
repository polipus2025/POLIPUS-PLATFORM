// Demo script to create and approve a demo exporter for testing
// This demonstrates the complete workflow from onboarding to portal access

import axios from 'axios';

const API_BASE = 'http://localhost:5000';

async function setupDemoExporter() {
  console.log('🚀 Setting up demo exporter for testing...');
  
  try {
    // 1. Create a new exporter via the regulatory portal onboarding system
    console.log('1. Creating exporter via regulatory onboarding...');
    const exporterData = {
      companyName: 'Demo Export Company Ltd.',
      contactPerson: 'John Doe',
      email: 'john.doe@demoexport.lr',
      phoneNumber: '+231-77-123-4567',
      address: '123 Export Street, Monrovia',
      district: 'Monrovia District',
      exportLicense: 'EXP-LIC-2025-DEMO',
      licenseExpiryDate: '2025-12-31',
      commodityTypes: ['Coffee', 'Cocoa'],
      accountNumber: '1234567890',
      bankName: 'Liberia Bank for Development and Investment'
    };
    
    const createResponse = await axios.post(`${API_BASE}/api/exporters`, exporterData);
    console.log('✅ Exporter created:', createResponse.data.exporterId);
    
    // 2. Approve the exporter and generate credentials
    console.log('2. Approving exporter and generating credentials...');
    const exporterId = createResponse.data.id;
    const approveResponse = await axios.post(`${API_BASE}/api/exporters/${exporterId}/approve`);
    console.log('✅ Exporter approved and credentials generated:', approveResponse.data.credentials);
    
    console.log('\n🎉 Demo exporter setup complete!');
    console.log('\n📋 Login Credentials for Exporter Portal:');
    console.log(`   Username: ${approveResponse.data.credentials.username}`);
    console.log(`   Temporary Password: ${approveResponse.data.credentials.temporaryPassword}`);
    console.log(`   Portal URL: ${API_BASE}${approveResponse.data.credentials.portalUrl}`);
    console.log('\n📌 Test Steps:');
    console.log('1. Go to the Exporter Login page');
    console.log('2. Use the credentials above to login');
    console.log('3. You will be prompted to change your password on first login');
    console.log('4. After changing password, you\'ll have full access to the Exporter Portal');
    
  } catch (error) {
    console.error('❌ Error setting up demo exporter:', error.response?.data || error.message);
  }
}

// Run the setup
setupDemoExporter();