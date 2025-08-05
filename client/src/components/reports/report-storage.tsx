import { apiRequest } from "@/lib/queryClient";

export interface ComplianceReportData {
  eudrCompliance: {
    riskLevel: 'low' | 'standard' | 'high';
    complianceScore: number;
    deforestationRisk: number;
    lastForestDate: string;
    coordinates: string;
    documentationRequired: string[];
    recommendations: string[];
    reportId: string;
    generatedAt: string;
  };
  deforestationReport: {
    forestLossDetected: boolean;
    forestLossDate: string | null;
    forestCoverChange: number;
    biodiversityImpact: 'minimal' | 'moderate' | 'significant';
    carbonStockLoss: number;
    mitigationRequired: boolean;
    recommendations: string[];
    reportId: string;
    generatedAt: string;
  };
}

export const generateReportIds = () => {
  const timestamp = Date.now().toString().slice(-6);
  const eudrId = `EUDR-${timestamp}`;
  const deforestationId = `DFR-${timestamp}`;
  return { eudrId, deforestationId };
};

export const createComplianceReports = (
  eudrData: any,
  deforestationData: any,
  farmerId: string
): ComplianceReportData => {
  const { eudrId, deforestationId } = generateReportIds();
  const generatedAt = new Date().toISOString();

  return {
    eudrCompliance: {
      ...eudrData,
      reportId: eudrId,
      generatedAt
    },
    deforestationReport: {
      ...deforestationData,
      reportId: deforestationId,
      generatedAt
    }
  };
};

export const saveComplianceReports = async (
  farmerId: string,
  reports: ComplianceReportData
): Promise<void> => {
  try {
    // Save EUDR compliance report
    await apiRequest('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        reportId: reports.eudrCompliance.reportId,
        title: `EUDR Compliance Report - Farmer ${farmerId}`,
        type: 'eudr_compliance',
        generatedBy: 'system',
        department: 'compliance',
        summary: `EUDR compliance assessment for farmer ${farmerId}. Risk Level: ${reports.eudrCompliance.riskLevel.toUpperCase()}, Compliance Score: ${reports.eudrCompliance.complianceScore}%`,
        data: JSON.stringify(reports.eudrCompliance),
        status: 'completed'
      })
    });

    // Save deforestation report
    await apiRequest('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        reportId: reports.deforestationReport.reportId,
        title: `Deforestation Analysis Report - Farmer ${farmerId}`,
        type: 'deforestation_analysis',
        generatedBy: 'system',
        department: 'environmental',
        summary: `Environmental impact assessment for farmer ${farmerId}. Forest Loss: ${reports.deforestationReport.forestLossDetected ? 'Detected' : 'None'}, Carbon Loss: ${reports.deforestationReport.carbonStockLoss} tCO₂`,
        data: JSON.stringify(reports.deforestationReport),
        status: 'completed'
      })
    });

  } catch (error) {
    console.error('Failed to save compliance reports:', error);
    throw error;
  }
};

export const updateFarmerWithReports = async (
  farmerId: string,
  farmerData: any,
  reports: ComplianceReportData
): Promise<void> => {
  try {
    // Update farmer record with comprehensive data including reports
    const updatedFarmerData = {
      ...farmerData,
      landMapData: {
        ...farmerData.landMapData,
        eudrCompliance: reports.eudrCompliance,
        deforestationReport: reports.deforestationReport
      }
    };

    await apiRequest(`/api/farmers/${farmerId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFarmerData)
    });

    // Save individual reports for tracking
    await saveComplianceReports(farmerId, reports);

  } catch (error) {
    console.error('Failed to update farmer with reports:', error);
    throw error;
  }
};