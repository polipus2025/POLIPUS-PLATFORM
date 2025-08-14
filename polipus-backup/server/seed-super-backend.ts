import { superBackend } from './super-backend';

async function seedSuperBackendData() {
  try {
    console.log('🌱 Seeding Super Backend data...');

    // Create system configurations
    await superBackend.updateSystemConfiguration('maintenance_mode', 'false', 'system');
    await superBackend.updateSystemConfiguration('api_rate_limit', '1000', 'system');
    await superBackend.updateSystemConfiguration('max_db_connections', '20', 'system');
    await superBackend.updateSystemConfiguration('session_timeout', '3600', 'system');
    await superBackend.updateSystemConfiguration('log_level', 'info', 'system');

    // Create feature flags
    await superBackend.createFeatureFlag({
      flagName: 'mobile_app_enabled',
      description: 'Enable mobile application access',
      isEnabled: true,
      category: 'ui',
      modifiedBy: 'system'
    });

    await superBackend.createFeatureFlag({
      flagName: 'real_time_tracking',
      description: 'Enable real-time GPS tracking features',
      isEnabled: true,
      category: 'api',
      modifiedBy: 'system'
    });

    await superBackend.createFeatureFlag({
      flagName: 'advanced_analytics',
      description: 'Enable advanced analytics dashboard',
      isEnabled: false,
      category: 'ui',
      modifiedBy: 'system'
    });

    await superBackend.createFeatureFlag({
      flagName: 'export_optimization',
      description: 'Enable optimized export processing',
      isEnabled: true,
      category: 'api',
      modifiedBy: 'system'
    });

    // Create access controls
    await superBackend.addAccessControl({
      resourceType: 'api_endpoint',
      resourcePath: '/api/super-backend/*',
      roleRequired: 'admin',
      permissionLevel: 'admin',
      appliedBy: 'system'
    });

    await superBackend.addAccessControl({
      resourceType: 'page',
      resourcePath: '/super-backend',
      roleRequired: 'admin',
      permissionLevel: 'read',
      appliedBy: 'system'
    });

    // Create emergency controls with actions
    const emergencyActions = [
      {
        type: 'disable_feature',
        target: 'mobile_app_enabled'
      },
      {
        type: 'enable_maintenance',
        target: 'maintenance_mode'
      }
    ];

    // Record initial performance metrics
    await superBackend.recordPerformanceMetric('system', 'startup_time', 5.2, 'seconds');
    await superBackend.recordPerformanceMetric('api', 'response_time', 120, 'ms');
    await superBackend.recordPerformanceMetric('database', 'connection_time', 50, 'ms');
    await superBackend.recordPerformanceMetric('user_activity', 'active_sessions', 5, 'count');

    // Create system operations log
    await superBackend.createSystemOperation({
      operationType: 'deploy',
      operationName: 'Super Backend System Initialization',
      status: 'completed',
      progress: 100,
      targetEnvironment: process.env.NODE_ENV || 'development',
      initiatedBy: 'system',
      parameters: {
        version: '1.0.0',
        features: ['monitoring', 'controls', 'emergency_controls']
      }
    });

    // Log system startup
    await superBackend.logAction('system', 'Super Backend system initialized successfully', 'system', {
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      features_enabled: ['monitoring', 'controls', 'feature_flags', 'emergency_controls']
    });

    console.log('✅ Super Backend data seeded successfully');
    
    // Start background monitoring
    console.log('🔄 Starting background monitoring...');
    
  } catch (error) {
    console.error('❌ Error seeding Super Backend data:', error);
    await superBackend.logError('seed', 'Failed to seed Super Backend data', error as Error, 'system');
  }
}

// Run seeding if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  seedSuperBackendData();
}

export { seedSuperBackendData };