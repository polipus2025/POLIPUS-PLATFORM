import { db } from './db';
import { regulatoryDepartments } from '@shared/schema';
import bcrypt from 'bcryptjs';

export async function seedRegulatoryDepartments() {
  try {
    console.log('🏛️ Seeding Regulatory Departments - Three-Tier System...');
    
    const departments = [
      // 1. Director General Level (DG)
      {
        regulatorId: "REG-DG-001",
        username: "director_general",
        passwordHash: await bcrypt.hash("dgpassword123", 10),
        firstName: "John",
        lastName: "Cooper",
        fullName: "John Cooper",
        email: "director.general@lacra.lr",
        phoneNumber: "+231-77-555-0001",
        departmentLevel: "dg",
        departmentName: "Director General Office",
        accessLevel: "executive",
        position: "Director General",
        permissions: JSON.stringify({
          fullSystemAccess: true,
          approveExporters: true,
          manageBudgets: true,
          systemConfiguration: true,
          appointOfficials: true,
          policyDecisions: true,
          internationalAgreements: true,
          emergencyControls: true,
          auditReports: true,
          strategicPlanning: true
        }),
        isActive: true,
        mustChangePassword: false,
      },
      
      // 2. Deputy Director General Operations & Technical Services (DDGOTS)
      {
        regulatorId: "REG-DDGOTS-001",
        username: "ddg_operations",
        passwordHash: await bcrypt.hash("ddgotspassword123", 10),
        firstName: "Sarah",
        lastName: "Johnson",
        fullName: "Sarah Johnson",
        email: "ddg.operations@lacra.lr",
        phoneNumber: "+231-77-555-0002",
        departmentLevel: "ddgots",
        departmentName: "Operations & Technical Services",
        accessLevel: "operations",
        position: "Deputy Director General - Operations & Technical Services",
        permissions: JSON.stringify({
          inspectionManagement: true,
          farmManagement: true,
          landMapping: true,
          cropMonitoring: true,
          qualityControl: true,
          laboratoryOversight: true,
          fieldOperations: true,
          inspectorSupervision: true,
          technicalStandards: true,
          complianceMonitoring: true,
          certificateIssuance: true,
          exportPermits: true,
          traceabilitySystem: true,
          eudrCompliance: true,
          satelliteMonitoring: true
        }),
        isActive: true,
        mustChangePassword: false,
      },
      
      // 3. Deputy Director General Admin & Finance (DDGAF)  
      {
        regulatorId: "REG-DDGAF-001",
        username: "ddg_finance",
        passwordHash: await bcrypt.hash("ddgafpassword123", 10),
        firstName: "Michael",
        lastName: "Davis",
        fullName: "Michael Davis",
        email: "ddg.finance@lacra.lr",
        phoneNumber: "+231-77-555-0003",
        departmentLevel: "ddgaf",
        departmentName: "Administration & Finance",
        accessLevel: "finance",
        position: "Deputy Director General - Administration & Finance",
        permissions: JSON.stringify({
          financialManagement: true,
          budgetPlanning: true,
          payrollManagement: true,
          procurement: true,
          hrManagement: true,
          staffRecruitment: true,
          trainingPrograms: true,
          officeAdministration: true,
          contractManagement: true,
          auditCoordination: true,
          financialReporting: true,
          revenueManagement: true,
          expenseTracking: true,
          assetManagement: true,
          insuranceManagement: true
        }),
        isActive: true,
        mustChangePassword: false,
      }
    ];

    for (const department of departments) {
      await db.insert(regulatoryDepartments).values(department);
      console.log(`✅ Created ${department.departmentLevel.toUpperCase()} department: ${department.fullName}`);
    }

    console.log('🎉 Regulatory Departments seeded successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('1. Director General: director_general / dgpassword123');
    console.log('2. Operations & Technical: ddg_operations / ddgotspassword123');
    console.log('3. Admin & Finance: ddg_finance / ddgafpassword123');
    
  } catch (error) {
    console.error('❌ Error seeding regulatory departments:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRegulatoryDepartments()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}