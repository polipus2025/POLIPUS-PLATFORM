import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { 
  regulatoryDepartments, 
  commodities, 
  inspections, 
  certifications,
  exporters,
  buyers,
  farmers,
  harvestSchedules,
  landMappingInspections,
  softCommodities
} from '../shared/schema';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create DG Level Administrator (Setup endpoint)
router.post('/dg-level/setup/create-admin', async (req, res) => {
  try {
    console.log('🏛️ SETTING UP DG LEVEL ADMINISTRATOR...');

    const password = "dg123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert DG administrator directly using complete schema
    const [dgAdmin] = await db.insert(regulatoryDepartments).values({
      regulatorId: "DG-001-LACRA",
      username: "dg.admin",
      passwordHash: hashedPassword,
      firstName: "Director",
      lastName: "General", 
      fullName: "Director General LACRA",
      email: "dg@lacra.gov.lr",
      phoneNumber: "+231770000001",
      departmentLevel: "dg", // Director General - Highest Level
      departmentName: "LACRA Director General Office",
      accessLevel: "executive",
      position: "Director General - Final Authority",
      permissions: JSON.stringify(["final_approval", "full_oversight", "read_only_all_portals"]),
      isActive: true
    }).returning();

    console.log('✅ DG LEVEL ADMINISTRATOR CREATED:', dgAdmin.username);

    res.json({
      success: true,
      message: "DG Level administrator created successfully",
      credentials: {
        username: "dg.admin",
        password: "dg123",
        role: "dg",
        permissions: ["final_approval", "full_oversight", "read_only_all_portals"]
      }
    });

  } catch (error) {
    console.error('❌ ERROR CREATING DG ADMINISTRATOR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create DG administrator'
    });
  }
});

// ============================================================================
// DG LEVEL (DIRECTOR GENERAL) - HIGHEST AUTHORITY IMPLEMENTATION
// ============================================================================

// DG Level Authentication
router.post('/dg-level/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🏛️ DG LEVEL LOGIN ATTEMPT:', username);
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }

    // Find DG Level regulator
    const [dgRegulator] = await db.select()
      .from(regulatoryDepartments)
      .where(and(
        eq(regulatoryDepartments.username, username),
        eq(regulatoryDepartments.departmentLevel, 'dg')
      ))
      .limit(1);

    if (!dgRegulator) {
      console.log('❌ DG LEVEL: Invalid credentials or unauthorized access');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials or unauthorized DG access level" 
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, dgRegulator.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    if (!dgRegulator.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: "DG account is deactivated" 
      });
    }

    // Generate DG Level JWT token with highest privileges
    const token = jwt.sign(
      { 
        userId: dgRegulator.id,
        username: dgRegulator.username,
        role: 'dg',
        departmentLevel: 'dg',
        userType: 'dg_director_general',
        permissions: ['final_approval', 'full_oversight', 'read_only_all_portals']
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ DG LEVEL LOGIN SUCCESSFUL:', dgRegulator.firstName, dgRegulator.lastName);
    
    res.json({
      success: true,
      token,
      user: {
        id: dgRegulator.id,
        username: dgRegulator.username,
        role: 'dg',
        departmentLevel: 'dg',
        userType: 'dg_director_general',
        firstName: dgRegulator.firstName,
        lastName: dgRegulator.lastName,
        departmentName: dgRegulator.departmentName,
        permissions: ['final_approval', 'full_oversight', 'read_only_all_portals']
      },
      message: "DG Level access granted"
    });

  } catch (error) {
    console.error('❌ DG LEVEL LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during DG authentication'
    });
  }
});

// ============================================================================
// DG LEVEL FINAL APPROVAL WORKFLOWS
// ============================================================================

// Get all items pending DG approval (after DDGOTS review)
router.get('/dg-level/pending-approvals', async (req, res) => {
  try {
    console.log('📋 DG LEVEL: Fetching all pending approvals...');

    // Get export permits pending DG final approval
    const exportPermits = await db.select()
      .from(certifications)
      .where(and(
        eq(certifications.certificateType, 'export'),
        eq(certifications.status, 'ddgots_reviewed')
      ))
      .orderBy(desc(certifications.createdAt));

    // Get exporter licenses pending DG final approval
    const exporterLicenses = await db.select()
      .from(exporters)
      .where(eq(exporters.complianceStatus, 'ddgots_approved'))
      .orderBy(desc(exporters.createdAt));

    // Get compliance reports pending DG oversight
    const complianceReports = await db.select()
      .from(inspections)
      .where(eq(inspections.complianceStatus, 'ddgots_verified'))
      .orderBy(desc(inspections.createdAt));

    const pendingApprovals = {
      exportPermits: exportPermits.length,
      exporterLicenses: exporterLicenses.length,
      complianceReports: complianceReports.length,
      totalPending: exportPermits.length + exporterLicenses.length + complianceReports.length,
      items: {
        exportPermits,
        exporterLicenses,
        complianceReports
      }
    };

    console.log('✅ DG LEVEL: Found', pendingApprovals.totalPending, 'items pending approval');

    res.json({
      success: true,
      data: pendingApprovals,
      message: `${pendingApprovals.totalPending} items pending DG final approval`
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR fetching pending approvals:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending approvals' 
    });
  }
});

// ============================================================================
// DG LEVEL ITEM DETAILS - For review before approval/rejection
// ============================================================================

// Get detailed information for export permit review
router.get('/dg-level/export-permit-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 DG LEVEL: Fetching export permit details for ID: ${id}`);

    // Get export permit with full details
    const [permit] = await db.select()
      .from(certifications)
      .where(eq(certifications.id, parseInt(id)));

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: 'Export permit not found'
      });
    }

    // Get related commodity information
    const [commodity] = await db.select()
      .from(commodities)
      .where(eq(commodities.id, permit.commodityId));

    // Get related farmer information if available
    let farmer = null;
    if (commodity?.farmerId) {
      const farmerResult = await db.select()
        .from(farmers)
        .where(eq(farmers.farmerId, commodity.farmerId));
      farmer = farmerResult[0] || null;
    }

    // Get inspection history
    const inspections = await db.select()
      .from(inspections)
      .where(eq(inspections.commodityId, permit.commodityId))
      .orderBy(desc(inspections.createdAt));

    const permitDetails = {
      permit,
      commodity,
      farmer,
      inspections,
      ddgotsReview: {
        reviewDate: permit.ddgotsReviewDate,
        reviewNotes: permit.ddgotsReviewNotes,
        reviewer: permit.ddgotsReviewer
      },
      readyForDgApproval: permit.status === 'ddgots_reviewed'
    };

    res.json({
      success: true,
      data: permitDetails,
      message: 'Export permit details for DG review'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR fetching permit details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch permit details' 
    });
  }
});

// Get detailed information for exporter license review
router.get('/dg-level/exporter-license-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 DG LEVEL: Fetching exporter license details for ID: ${id}`);

    // Get exporter with full details
    const [exporter] = await db.select()
      .from(exporters)
      .where(eq(exporters.id, parseInt(id)));

    if (!exporter) {
      return res.status(404).json({
        success: false,
        message: 'Exporter not found'
      });
    }

    // Get exporter's transaction history
    const transactions = await db.select()
      .from(commodities)
      .where(eq(commodities.buyerId, exporter.id))
      .orderBy(desc(commodities.createdAt));

    // Get related certifications
    const certifications = await db.select()
      .from(certifications)
      .where(eq(certifications.exporterName, exporter.companyName))
      .orderBy(desc(certifications.createdAt));

    const exporterDetails = {
      exporter,
      transactions,
      certifications,
      ddgotsReview: {
        approvalDate: exporter.ddgotsApprovalDate,
        approvalNotes: exporter.ddgotsApprovalNotes,
        reviewer: exporter.ddgotsReviewer
      },
      readyForDgApproval: exporter.complianceStatus === 'ddgots_approved'
    };

    res.json({
      success: true,
      data: exporterDetails,
      message: 'Exporter license details for DG review'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR fetching exporter details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch exporter details' 
    });
  }
});

// Get detailed information for compliance report review
router.get('/dg-level/compliance-report-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 DG LEVEL: Fetching compliance report details for ID: ${id}`);

    // Get inspection with full details
    const [inspection] = await db.select()
      .from(inspections)
      .where(eq(inspections.id, parseInt(id)));

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: 'Compliance report not found'
      });
    }

    // Get related commodity information
    const [commodity] = await db.select()
      .from(commodities)
      .where(eq(commodities.id, inspection.commodityId));

    // Get related farmer information
    let farmer = null;
    if (commodity?.farmerId) {
      [farmer] = await db.select()
        .from(farmers)
        .where(eq(farmers.id, commodity.farmerId));
    }

    // Get inspector information
    const [inspector] = await db.select()
      .from(regulatoryStaff)
      .where(eq(regulatoryStaff.id, inspection.inspectorId));

    const complianceDetails = {
      inspection,
      commodity,
      farmer,
      inspector,
      ddgotsReview: {
        verificationDate: inspection.ddgotsVerificationDate,
        verificationNotes: inspection.ddgotsVerificationNotes,
        verifier: inspection.ddgotsVerifier
      },
      readyForDgApproval: inspection.complianceStatus === 'ddgots_verified'
    };

    res.json({
      success: true,
      data: complianceDetails,
      message: 'Compliance report details for DG review'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR fetching compliance details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch compliance details' 
    });
  }
});

// DG Final Approval for Export Permits
router.post('/dg-level/approve-export-permit/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { dgNotes, conditions } = req.body;

    console.log('🏛️ DG LEVEL: Final approval for export permit:', certificateId);

    // Update certificate status to DG approved
    const [updatedCertificate] = await db.update(certifications)
      .set({
        status: 'dg_approved',
        dgApprovalDate: new Date(),
        dgApprovalNotes: dgNotes,
        dgApprovalConditions: conditions,
        finalApproval: true
      })
      .where(eq(certifications.id, parseInt(certificateId)))
      .returning();

    if (!updatedCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Export permit not found'
      });
    }

    console.log('✅ DG LEVEL: Export permit approved by Director General');

    res.json({
      success: true,
      data: updatedCertificate,
      message: 'Export permit approved by Director General'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR approving export permit:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve export permit' 
    });
  }
});

// DG Final Approval for Exporter Licenses
router.post('/dg-level/approve-exporter-license/:exporterId', async (req, res) => {
  try {
    const { exporterId } = req.params;
    const { dgNotes, licenseConditions } = req.body;

    console.log('🏛️ DG LEVEL: Final approval for exporter license:', exporterId);

    // Update exporter status to DG approved
    const [updatedExporter] = await db.update(exporters)
      .set({
        complianceStatus: 'dg_approved',
        dgApprovalDate: new Date(),
        dgApprovalNotes: dgNotes,
        licenseConditions: licenseConditions,
        finalLicenseApproval: true,
        licenseActive: true
      })
      .where(eq(exporters.exporterId, exporterId))
      .returning();

    if (!updatedExporter) {
      return res.status(404).json({
        success: false,
        message: 'Exporter not found'
      });
    }

    console.log('✅ DG LEVEL: Exporter license approved by Director General');

    res.json({
      success: true,
      data: updatedExporter,
      message: 'Exporter license approved by Director General'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR approving exporter license:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve exporter license' 
    });
  }
});

// ============================================================================
// DG LEVEL FULL OVERSIGHT - READ-ONLY ACCESS TO ALL PORTALS
// ============================================================================

// DG Dashboard - Final Approval Authority & Read-Only Oversight Only
router.get('/dg-level/dashboard', async (req, res) => {
  try {
    console.log('📊 DG LEVEL: Loading DG authority dashboard...');

    // Count pending items requiring DG final approval
    const pendingExportPermits = await db.select()
      .from(certifications)
      .where(and(
        eq(certifications.certificateType, 'export'),
        eq(certifications.status, 'ddgots_reviewed')
      ));

    const pendingExporterLicenses = await db.select()
      .from(exporters)
      .where(eq(exporters.complianceStatus, 'ddgots_approved'));

    const pendingComplianceReports = await db.select()
      .from(inspections)
      .where(eq(inspections.complianceStatus, 'ddgots_verified'));

    // DG approved items statistics
    const dgApprovedPermits = await db.select()
      .from(certifications)
      .where(eq(certifications.status, 'dg_approved'));

    const dgApprovedExporters = await db.select()
      .from(exporters)
      .where(eq(exporters.complianceStatus, 'dg_approved'));

    // Basic system overview counts (read-only oversight)
    const [farmerCount] = await db.select({ count: sql`count(*)` }).from(farmers);
    const [buyerCount] = await db.select({ count: sql`count(*)` }).from(buyers);
    const [exporterCount] = await db.select({ count: sql`count(*)` }).from(exporters);
    const [inspectionCount] = await db.select({ count: sql`count(*)` }).from(inspections);

    const dgDashboard = {
      // Final Approval Authority Section
      finalApprovalQueue: {
        pendingExportPermits: pendingExportPermits.length,
        pendingExporterLicenses: pendingExporterLicenses.length,
        pendingComplianceReports: pendingComplianceReports.length,
        totalPendingApprovals: pendingExportPermits.length + pendingExporterLicenses.length + pendingComplianceReports.length
      },
      
      // DG Approved Items
      dgApprovals: {
        approvedExportPermits: dgApprovedPermits.length,
        approvedExporterLicenses: dgApprovedExporters.length,
        totalDgApprovals: dgApprovedPermits.length + dgApprovedExporters.length
      },

      // Read-Only System Oversight 
      systemOversight: {
        totalFarmers: farmerCount.count,
        totalBuyers: buyerCount.count,
        totalExporters: exporterCount.count,
        totalInspections: inspectionCount.count
      }
    };

    console.log('✅ DG LEVEL: Authority dashboard loaded');

    res.json({
      success: true,
      data: dgDashboard,
      message: 'DG Level authority dashboard - Final approval and oversight only'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR loading dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load DG dashboard' 
    });
  }
});

// DG Read-Only Access to Farmer Portal Data
router.get('/dg-level/farmer-portal-overview', async (req, res) => {
  try {
    console.log('👨‍🌾 DG LEVEL: Accessing farmer portal data...');

    const farmers = await db.select().from(farmers);
    const harvestSchedules = await db.select().from(harvestSchedules);
    const landMappings = await db.select().from(landMappingInspections);

    res.json({
      success: true,
      data: {
        farmers,
        harvestSchedules,
        landMappings,
        summary: {
          totalFarmers: farmers.length,
          activeHarvests: harvestSchedules.filter(h => h.status === 'active').length,
          completedMappings: landMappings.filter(l => l.status === 'completed').length
        }
      },
      message: 'DG Level farmer portal overview'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR accessing farmer portal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to access farmer portal data' 
    });
  }
});

// DG Read-Only Access to Buyer Portal Data
router.get('/dg-level/buyer-portal-overview', async (req, res) => {
  try {
    console.log('💼 DG LEVEL: Accessing buyer portal data...');

    const buyers = await db.select().from(buyers);
    const transactions = await db.select().from(commodities).where(eq(commodities.status, 'sold'));

    res.json({
      success: true,
      data: {
        buyers,
        transactions,
        summary: {
          totalBuyers: buyers.length,
          activeBuyers: buyers.filter(b => b.isActive).length,
          totalTransactions: transactions.length
        }
      },
      message: 'DG Level buyer portal overview'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR accessing buyer portal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to access buyer portal data' 
    });
  }
});

// DG Read-Only Access to Exporter Portal Data  
router.get('/dg-level/exporter-portal-overview', async (req, res) => {
  try {
    console.log('🚢 DG LEVEL: Accessing exporter portal data...');

    const exporters = await db.select().from(exporters);
    const exportCertificates = await db.select().from(certifications)
      .where(eq(certifications.certificateType, 'export'));

    res.json({
      success: true,
      data: {
        exporters,
        exportCertificates,
        summary: {
          totalExporters: exporters.length,
          approvedExporters: exporters.filter(e => e.complianceStatus === 'dg_approved').length,
          totalExportCertificates: exportCertificates.length
        }
      },
      message: 'DG Level exporter portal overview'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR accessing exporter portal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to access exporter portal data' 
    });
  }
});

// DG Level Complete System Reports
router.get('/dg-level/system-reports', async (req, res) => {
  try {
    console.log('📈 DG LEVEL: Generating complete system reports...');

    const inspections = await db.select().from(inspections);
    const certifications = await db.select().from(certifications);
    const commodities = await db.select().from(commodities);

    const systemReports = {
      complianceReport: {
        totalInspections: inspections.length,
        compliantInspections: inspections.filter(i => i.complianceStatus === 'compliant').length,
        nonCompliantInspections: inspections.filter(i => i.complianceStatus === 'non_compliant').length,
        pendingReview: inspections.filter(i => i.complianceStatus === 'review_required').length
      },
      certificationReport: {
        totalCertificates: certifications.length,
        activeCertificates: certifications.filter(c => c.status === 'active').length,
        expiredCertificates: certifications.filter(c => c.status === 'expired').length,
        dgApprovedCertificates: certifications.filter(c => c.status === 'dg_approved').length
      },
      commodityReport: {
        totalCommodities: commodities.length,
        pendingCommodities: commodities.filter(c => c.status === 'pending').length,
        compliantCommodities: commodities.filter(c => c.status === 'compliant').length
      }
    };

    res.json({
      success: true,
      data: systemReports,
      message: 'DG Level complete system reports'
    });

  } catch (error) {
    console.error('❌ DG LEVEL ERROR generating system reports:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate system reports' 
    });
  }
});

export default router;