import bcrypt from 'bcryptjs';
import { db } from './db';
import { inspectorCredentials } from '../shared/schema';

async function createInspectorCredentials() {
  try {
    // Hash the password "password123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    console.log('Creating inspector credentials...');
    
    // Land Inspector
    await db.insert(inspectorCredentials).values({
      inspectorId: 'INS-LAND-001',
      username: 'land_inspector',
      passwordHash: hashedPassword,
      salt: salt,
      inspectorType: 'land',
      mustChangePassword: false,
    });
    
    // Port Inspector
    await db.insert(inspectorCredentials).values({
      inspectorId: 'INS-PORT-001',
      username: 'port_inspector',
      passwordHash: hashedPassword,
      salt: salt,
      inspectorType: 'port',
      mustChangePassword: false,
    });
    
    console.log('✅ Inspector credentials created successfully!');
    console.log('Land Inspector: username="land_inspector", password="password123"');
    console.log('Port Inspector: username="port_inspector", password="password123"');
    
  } catch (error) {
    console.error('❌ Error creating inspector credentials:', error);
  }
  
  process.exit(0);
}

createInspectorCredentials();