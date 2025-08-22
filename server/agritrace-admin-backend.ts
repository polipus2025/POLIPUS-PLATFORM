import { db } from './db';
import { 
  systemConfigurations, 
  realTimeControls, 
  backendMonitoring, 
  systemOperations, 
  featureFlags, 
  accessControlMatrix, 
  emergencyControls, 
  performanceMetrics,
  backendLogs,
  type SystemConfiguration,
  type RealTimeControl,
  type BackendMonitoring,
  type SystemOperation,
  type FeatureFlag,
  type AccessControlMatrix,
  type EmergencyControl,
  type PerformanceMetric,
  type BackendLog,
  type InsertSystemConfiguration,
  type InsertRealTimeControl,
  type InsertBackendMonitoring,
  type InsertSystemOperation,
  type InsertFeatureFlag,
  type InsertAccessControlMatrix,
  type InsertEmergencyControl,
  type InsertPerformanceMetric,
  type InsertBackendLog
} from "@shared/schema";
import { eq, desc, and, gte, lte, count, avg, max, min, like } from "drizzle-orm";
import os from 'os';
import { performance } from 'perf_hooks';

/**
 * AgriTrace360™ System Administrator Backend Controller
 * Limited administrative functionality specific to AgriTrace module only
 * Separate from broader Polipus platform administration
 */
export class AgriTraceAdminController {
  
  // AgriTrace-specific System Configuration Management
  async getAgriTraceConfigurations(category?: string) {
    const conditions = [
      like(systemConfigurations.configKey, 'agritrace%'),
      ...(category ? [eq(systemConfigurations.category, category)] : [])
    ];
    return await db.select()
      .from(systemConfigurations)
      .where(and(...conditions))
      .orderBy(desc(systemConfigurations.modifiedAt));
  }

  async updateAgriTraceConfiguration(configKey: string, configValue: string, modifiedBy: string) {
    // Ensure config key is AgriTrace-specific
    if (!configKey.startsWith('agritrace_')) {
      throw new Error('Configuration key must be AgriTrace-specific (agritrace_ prefix)');
    }

    const [config] = await db.select()
      .from(systemConfigurations)
      .where(eq(systemConfigurations.configKey, configKey));

    if (config) {
      await db.update(systemConfigurations)
        .set({
          configValue,
          modifiedBy,
          modifiedAt: new Date()
        })
        .where(eq(systemConfigurations.configKey, configKey));
    } else {
      await db.insert(systemConfigurations).values({
        configKey,
        configValue,
        configType: 'string',
        category: 'agritrace',
        modifiedBy
      });
    }

    await this.logAgriTraceAction('agritrace_config', `Updated AgriTrace configuration: ${configKey}`, modifiedBy);
  }

  // AgriTrace-specific Real-Time Control System
  async applyAgriTraceControl(control: InsertRealTimeControl) {
    // Ensure control is AgriTrace-specific
    const agriTraceControl = {
      ...control,
      targetEntity: control.targetEntity.startsWith('agritrace_') ? control.targetEntity : `agritrace_${control.targetEntity}`,
      controlScope: 'agritrace_module'
    };

    const [newControl] = await db.insert(realTimeControls).values(agriTraceControl).returning();
    await this.logAgriTraceAction('agritrace_control', `Applied AgriTrace control: ${control.controlType} on ${control.targetEntity}`, control.appliedBy);
    return newControl;
  }

  async getAgriTraceControls(isActive: boolean = true) {
    return await db.select()
      .from(realTimeControls)
      .where(and(
        eq(realTimeControls.isActive, isActive),
        like(realTimeControls.targetEntity, 'agritrace%')
      ))
      .orderBy(realTimeControls.priority, desc(realTimeControls.appliedAt));
  }

  // AgriTrace System Monitoring
  async recordAgriTraceHealth() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg()[0];
    const systemData: InsertBackendMonitoring = {
      serviceType: 'agritrace_module',
      serviceName: 'agritrace_system',
      status: 'healthy',
      responseTime: '0',
      cpuUsage: cpuUsage.toString(),
      memoryUsage: (memoryUsage.heapUsed / 1024 / 1024).toString(),
      diskUsage: '0',
      activeConnections: 0,
      performanceMetrics: {
        module: 'agritrace',
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
      }
    };

    await db.insert(backendMonitoring).values(systemData);
  }

  async getAgriTraceHealth(hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db.select()
      .from(backendMonitoring)
      .where(and(
        gte(backendMonitoring.checkedAt, since),
        eq(backendMonitoring.serviceType, 'agritrace_module')
      ))
      .orderBy(desc(backendMonitoring.checkedAt));
  }

  // AgriTrace Feature Flags
  async getAgriTraceFeatureFlags() {
    return await db.select()
      .from(featureFlags)
      .where(like(featureFlags.flagName, 'agritrace%'))
      .orderBy(featureFlags.flagName);
  }

  async toggleAgriTraceFeature(flagName: string, isEnabled: boolean, modifiedBy: string) {
    if (!flagName.startsWith('agritrace_')) {
      throw new Error('Feature flag must be AgriTrace-specific (agritrace_ prefix)');
    }

    const [flag] = await db.select()
      .from(featureFlags)
      .where(eq(featureFlags.flagName, flagName));

    if (flag) {
      await db.update(featureFlags)
        .set({ isEnabled, modifiedBy, modifiedAt: new Date() })
        .where(eq(featureFlags.flagName, flagName));
    } else {
      await db.insert(featureFlags).values({
        category: 'agritrace',
        flagName,
        isEnabled,
        flagType: 'boolean',
        targetAudience: 'agritrace_users',
        modifiedBy
      });
    }

    await this.logAgriTraceAction('agritrace_feature', `Toggled AgriTrace feature ${flagName}: ${isEnabled}`, modifiedBy);
  }

  // AgriTrace Access Control
  async getAgriTraceAccessMatrix() {
    return await db.select()
      .from(accessControlMatrix)
      .where(like(accessControlMatrix.resourcePath, '/agritrace%'))
      .orderBy(accessControlMatrix.resourcePath);
  }

  // AgriTrace Performance Metrics
  async getAgriTracePerformanceMetrics(hours: number = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      return await db.select()
        .from(performanceMetrics)
        .where(and(
          gte(performanceMetrics.timestamp, since),
          like(performanceMetrics.metricName, 'agritrace%')
        ))
        .orderBy(desc(performanceMetrics.timestamp));
    } catch (error) {
      // Return empty array if table doesn't exist or has schema issues
      console.log('Performance metrics table not available, returning empty data');
      return [];
    }
  }

  async recordAgriTraceMetric(metric: InsertPerformanceMetric) {
    try {
      const agriTraceMetric = {
        ...metric,
        metricName: metric.metricName?.startsWith('agritrace_') ? metric.metricName : `agritrace_${metric.metricName || 'metric'}`,
        tags: { ...metric.tags, module: 'agritrace' }
      };

      await db.insert(performanceMetrics).values(agriTraceMetric);
    } catch (error) {
      console.log('Performance metrics recording failed, skipping');
    }
  }

  // AgriTrace Emergency Controls
  async triggerAgriTraceEmergency(control: InsertEmergencyControl) {
    try {
      const agriTraceEmergency = {
        ...control,
        controlName: `agritrace_${control.controlName}`,
        createdBy: control.createdBy || 'agritrace_admin'
      };

      const [emergency] = await db.insert(emergencyControls).values(agriTraceEmergency).returning();
      await this.logAgriTraceAction('agritrace_emergency', `Triggered AgriTrace emergency: ${control.controlName}`, control.createdBy || 'agritrace_admin');
      return emergency;
    } catch (error) {
      console.log('Emergency controls table not available, skipping');
      return null;
    }
  }

  // AgriTrace System Operations
  async executeAgriTraceOperation(operation: InsertSystemOperation) {
    try {
      const agriTraceOperation = {
        ...operation,
        operationType: `agritrace_${operation.operationType}`,
        initiatedBy: operation.initiatedBy || 'agritrace_admin'
      };

      const [newOp] = await db.insert(systemOperations).values(agriTraceOperation).returning();
      await this.logAgriTraceAction('agritrace_operation', `Executed AgriTrace operation: ${operation.operationType}`, operation.initiatedBy || 'agritrace_admin');
      return newOp;
    } catch (error) {
      console.log('System operations table not available, skipping');
      return null;
    }
  }

  // AgriTrace-specific logging
  async logAgriTraceAction(actionType: string, description: string, performedBy: string) {
    const logEntry: InsertBackendLog = {
      logLevel: 'info',
      service: 'agritrace_admin', // Fix: use 'service' instead of 'serviceName'
      message: `[AgriTrace Admin] ${description}`,
      userId: performedBy,
      requestId: `agritrace_${Date.now()}`,
      metadata: {
        module: 'agritrace',
        actionType,
        performedBy,
        timestamp: new Date().toISOString()
      }
    };

    await db.insert(backendLogs).values(logEntry);
  }

  // AgriTrace System Dashboard Data
  async getAgriTraceDashboardData() {
    const [health, features, controls, metrics] = await Promise.all([
      this.getAgriTraceHealth(24),
      this.getAgriTraceFeatureFlags(),
      this.getAgriTraceControls(true),
      this.getAgriTracePerformanceMetrics(24)
    ]);

    return {
      systemInfo: {
        platform: 'AgriTrace360™ Control Center',
        module: 'Agricultural Traceability System',
        scope: 'AgriTrace Module Only',
        adminType: 'Limited Administrative Activity',
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      },
      systemHealth: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: os.loadavg(),
        moduleSpecific: 'agritrace_only'
      },
      recentActivity: health.slice(0, 10),
      activeFeatures: features.filter(f => f.isEnabled),
      activeControls: controls,
      performanceOverview: {
        avgResponseTime: metrics.reduce((acc, m) => acc + parseFloat(m.value || '0'), 0) / metrics.length || 0,
        errorRate: metrics.length > 0 ? metrics.filter(m => m.metricType === 'error').length / metrics.length : 0,
        throughput: metrics.reduce((acc, m) => acc + parseFloat(m.value || '0'), 0)
      },
      restrictions: {
        platformAccess: false,
        otherModules: false,
        globalControls: false,
        crossModuleData: false
      },
      capabilities: [
        'Farmer Registration Management',
        'Crop Scheduling Administration', 
        'Harvest Validation Controls',
        'EUDR Compliance Monitoring',
        'Agricultural Data Analytics',
        'Farm Plot GPS Validation',
        'Batch Code Generation',
        'Quality Assurance Settings',
        'Document Verification Rules',
        'Performance Optimization Controls',
        'User Access Management',
        'Emergency System Controls',
        'Automated Report Generation',
        'Database Backup Management',
        'Audit Trail Administration',
        'Communication Settings Control'
      ]
    };
  }
}

// Export singleton instance
export const agriTraceAdmin = new AgriTraceAdminController();