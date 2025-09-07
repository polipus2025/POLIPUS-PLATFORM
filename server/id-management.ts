// 🎯 CENTRAL ID MANAGEMENT SYSTEM
// Universal ID generation with duplicate prevention

import { nanoid } from 'nanoid';

interface IdConfig {
  prefix: string;
  pattern: string;
  entityType: string;
  dateFormat?: 'YYYYMMDD' | 'YYYY' | 'YYYYMM';
  suffixLength?: number;
}

// 🔧 ID CONFIGURATION REGISTRY
const ID_CONFIGS: Record<string, IdConfig> = {
  // Inspection & Booking IDs
  PINSP: {
    prefix: 'PINSP',
    pattern: 'PINSP-YYYYMMDD-XXXX',
    entityType: 'inspection_booking',
    dateFormat: 'YYYYMMDD',
    suffixLength: 4
  },
  
  // Transaction & Offer IDs
  FPO: {
    prefix: 'FPO',
    pattern: 'FPO-YYYYMMDD-XXXX',
    entityType: 'farmer_product_offer',
    dateFormat: 'YYYYMMDD',
    suffixLength: 4
  },
  
  WDR: {
    prefix: 'WDR',
    pattern: 'WDR-YYYYMMDD-XXXX',
    entityType: 'warehouse_dispatch_request',
    dateFormat: 'YYYYMMDD',
    suffixLength: 4
  },
  
  // Custody & Storage IDs
  CUSTODY: {
    prefix: 'CUSTODY-SINGLE',
    pattern: 'CUSTODY-SINGLE-001-YYYYMMDD-XXX',
    entityType: 'custody_lot',
    dateFormat: 'YYYYMMDD',
    suffixLength: 3
  },
  
  // User & Entity IDs
  EXP: {
    prefix: 'EXP',
    pattern: 'EXP-YYYYMMDD-XXX',
    entityType: 'exporter',
    dateFormat: 'YYYYMMDD',
    suffixLength: 3
  },
  
  BYR: {
    prefix: 'BYR',
    pattern: 'BYR-YYYYMMDD-XXX',
    entityType: 'buyer',
    dateFormat: 'YYYYMMDD',
    suffixLength: 3
  },
  
  TXN: {
    prefix: 'TXN',
    pattern: 'TXN-YYYYMMDD-XXXX',
    entityType: 'transaction',
    dateFormat: 'YYYYMMDD',
    suffixLength: 4
  }
};

// 🔄 IN-MEMORY ID TRACKING (For development - in production would use database)
const generatedIds = new Set<string>();

// 📅 DATE FORMATTING UTILITY
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYYMMDD': return `${year}${month}${day}`;
    case 'YYYYMM': return `${year}${month}`;
    case 'YYYY': return `${year}`;
    default: return `${year}${month}${day}`;
  }
}

// 🎲 RANDOM SUFFIX GENERATOR
function generateSuffix(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 🎯 CORE ID GENERATION FUNCTION
export function generateUniqueId(idType: string, maxAttempts: number = 10): string {
  const config = ID_CONFIGS[idType];
  if (!config) {
    throw new Error(`Unknown ID type: ${idType}`);
  }
  
  const now = new Date();
  const dateStr = formatDate(now, config.dateFormat || 'YYYYMMDD');
  
  let attempts = 0;
  while (attempts < maxAttempts) {
    let generatedId: string;
    
    // Generate ID based on pattern
    if (idType === 'CUSTODY') {
      const suffix = generateSuffix(config.suffixLength || 3);
      generatedId = `CUSTODY-SINGLE-001-${dateStr}-${suffix}`;
    } else {
      const suffix = generateSuffix(config.suffixLength || 4);
      generatedId = `${config.prefix}-${dateStr}-${suffix}`;
    }
    
    // Check for duplicates
    if (!generatedIds.has(generatedId)) {
      generatedIds.add(generatedId);
      console.log(`✅ Generated unique ID: ${generatedId} (${config.entityType})`);
      return generatedId;
    }
    
    attempts++;
    console.log(`⚠️ ID collision detected, retrying... (${attempts}/${maxAttempts})`);
  }
  
  throw new Error(`Failed to generate unique ID for ${idType} after ${maxAttempts} attempts`);
}

// 🔍 ID VALIDATION
export function validateIdFormat(id: string): { valid: boolean; idType?: string; pattern?: string } {
  for (const [type, config] of Object.entries(ID_CONFIGS)) {
    if (id.startsWith(config.prefix)) {
      // Simple pattern check - in production would use regex
      return {
        valid: true,
        idType: type,
        pattern: config.pattern
      };
    }
  }
  
  return { valid: false };
}

// 📊 ID REGISTRY UTILITIES
export function getIdStats(): {
  totalGenerated: number;
  byType: Record<string, number>;
  recentIds: string[];
} {
  const byType: Record<string, number> = {};
  const recentIds = Array.from(generatedIds).slice(-10);
  
  // Count by type
  for (const id of generatedIds) {
    const validation = validateIdFormat(id);
    if (validation.valid && validation.idType) {
      byType[validation.idType] = (byType[validation.idType] || 0) + 1;
    }
  }
  
  return {
    totalGenerated: generatedIds.size,
    byType,
    recentIds
  };
}

// 🧹 CLEANUP UTILITY (for testing)
export function clearIdRegistry(): void {
  generatedIds.clear();
  console.log('🧹 ID registry cleared');
}

// 🎯 SPECIFIC ID GENERATORS (Convenience functions)
export const generateInspectionBookingId = () => generateUniqueId('PINSP');
export const generateFarmerOfferId = () => generateUniqueId('FPO');
export const generateDispatchRequestId = () => generateUniqueId('WDR');
export const generateCustodyLotId = () => generateUniqueId('CUSTODY');
export const generateExporterId = () => generateUniqueId('EXP');
export const generateBuyerId = () => generateUniqueId('BYR');
export const generateTransactionId = () => generateUniqueId('TXN');