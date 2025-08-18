# AgriTrace360™ LACRA EUDR Workflow - Complete 14-Step Process

## Overview
This is the complete documentation of the AgriTrace360™ workflow system as implemented for LACRA (Liberia Agriculture Commodity Regulatory Authority). The system follows the EU Deforestation Regulation (EUDR) compliance requirements through 14 structured steps.

## Current System Status
✅ **ACTIVE** - National Mapping Plan (Workflow ID: 1)  
✅ Database integration operational  
✅ Real data processing confirmed  
✅ API endpoints functional  

---

## STEP 1: National Mapping Plan Preparation
**Responsible:** LACRA  
**Status:** ACTIVE (Currently Running)

### Process:
- LACRA prepares comprehensive national plan to map all farms across Liberia's 15 counties
- Establishes mapping methodology and resource allocation
- Coordinates with local authorities for data collection framework

### Implementation:
```javascript
// API Endpoint: GET /api/agritrace/workflows
// Current Data: National Mapping Plan - Active since 2025-08-18
{
  "workflowName": "National Mapping Plan",
  "workflowType": "national_mapping", 
  "status": "active",
  "totalStages": 14,
  "workflowConfiguration": {
    "type": "national_plan",
    "counties": 15,
    "description": "LACRA prepares national plan to map all farms"
  }
}
```

---

## STEP 2: Inspector Registration and Assignment
**Responsible:** LACRA Field Operations

### Process:
- Register qualified inspectors for each county/district
- Assign inspectors to specific geographic areas
- Provide inspector credentials and contact information

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/inspector-registration
{
  "inspectorId": "INSP-MON-001",
  "name": "Inspector Name",
  "county": "County Name", 
  "area": "District/Area",
  "contact": "Phone Number"
}
```

### Database Records:
- Inspector credentials stored in agriTraceWorkflows table
- Workflow type: "inspector_registration"
- Automatic GPS area assignment

---

## STEP 3: Farmer Onboarding and Land Mapping
**Responsible:** LACRA Inspectors + Farmers

### Process:
- Inspector visits farmer and conducts land survey
- GPS mapping of farm boundaries and plots
- Record farmer details, crop types, and land use
- EUDR compliance preliminary assessment
- Deforestation risk evaluation

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/farmer-onboarding
{
  "farmerId": "FARM-MON-2024-001",
  "inspectorId": "INSP-MON-001", 
  "farmerName": "Farmer Name",
  "farmPlots": [
    {
      "plotId": "PLOT-001",
      "area": 2.5,
      "gpsCoordinates": "6.3026° N, 10.7971° W",
      "commodity": "Cocoa"
    }
  ],
  "estimatedOutput": 850,
  "eudrStatus": "compliant",
  "deforestationStatus": "negative"
}
```

### Generated Records:
- Workflow type: "farmer_onboarding"
- Current stage: "mapping" 
- Compliance record with EUDR status
- GPS coordinates stored for satellite monitoring

---

## STEP 4: Farmer Communication to Licensed Agents
**Responsible:** Farmers

### Process:
- Farmer notifies licensed agents when crops are ready for harvest
- Communication via online platform or SMS gateway (1111)
- Broadcast to all licensed agents in the county
- First-come-first-served sales basis

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/harvest-notification
{
  "farmerId": "FARM-MON-2024-001",
  "cropType": "Cocoa",
  "quantity": 850,
  "contactNumber": "+231-88-555-0123",
  "county": "Montserrado",
  "communicationMethod": "sms" // or "online"
}
```

### SMS Format:
```
${farmerId}, ${cropType}, ${quantity}, ${contactNumber}
```

---

## STEP 5: Agent-Farmer Agreement
**Responsible:** Licensed Agents + Farmers

### Process:
- Agent contacts farmer to negotiate purchase
- Generate unique reference code for the transaction
- Record agreement details in system
- Set pickup/delivery arrangements

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/generate-reference-code
{
  "farmerId": "FARM-MON-2024-001",
  "agentId": "AGENT-001", 
  "cropDetails": {
    "volume": 850,
    "cropType": "Cocoa",
    "location": "Paynesville District",
    "agentContact": "+231-88-555-0456"
  }
}
```

### Reference Code Format:
```
AGT-{timestamp}-{farmerId-last4}-{agentId-last4}
```

---

## STEP 6: Commodity Registration
**Responsible:** System (Automated)

### Process:
- Register all commodities in the batch with detailed information
- Record variety, planting dates, expected harvest, certifications
- Link to farmer and agent records
- Update workflow progress to stage 4

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/commodity-registration
{
  "workflowId": 3,
  "commodities": [
    {
      "type": "Cocoa",
      "variety": "Trinitario", 
      "plantingDate": "2023-04-15",
      "expectedHarvest": "2024-10-01",
      "certifications": ["Organic", "Fair Trade"]
    }
  ]
}
```

---

## STEP 7: EUDR Compliance Verification
**Responsible:** LACRA Compliance Team

### Process:
- Perform comprehensive EUDR Article 8 compliance check
- Satellite verification for deforestation risk
- Document compliance evidence
- Generate compliance score (0-100)

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/eudr-compliance
{
  "workflowId": 1,
  "complianceType": "eudr_verification",
  "requirement": "EU Deforestation Regulation Article 8",
  "status": "compliant",
  "evidence": {
    "deforestationRisk": "low",
    "satelliteVerification": true,
    "documentationComplete": true
  }
}
```

---

## STEP 8: Quality Assessment
**Responsible:** LACRA Quality Inspectors

### Process:
- Visual inspection of commodity quality
- Grade assignment (Grade A, B, C)
- Quality metrics recording
- Update workflow to "quality_assessed" stage

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/quality-assessment  
{
  "workflowId": 1,
  "qualityData": {
    "grade": "Grade A",
    "inspector": "LACRA-INSPECTOR"
  }
}
```

---

## STEP 9: Export Proposal Generation
**Responsible:** Licensed Agents/Exporters

### Process:
- Create export proposal with commodity details
- Include destination country and buyer information
- Generate proposal reference number
- Submit to exporter for review

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/export-proposal
{
  "referenceCode": "AGT-123456-001-002",
  "exportDetails": {
    "destination": "European Union",
    "buyer": "EU Commodity Trader",
    "quantity": 850,
    "proposedPrice": 2500,
    "exporterId": "EXP-001"
  }
}
```

---

## STEP 10: Exporter Response
**Responsible:** Exporters

### Process:
- Review export proposal
- Accept or decline the proposal
- If accepted, generate new reference number
- Update workflow status accordingly

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/exporter-response
{
  "workflowId": 5,
  "exporterId": "EXP-001", 
  "response": "accept" // or "decline"
}
```

---

## STEP 11: Warehouse Transfer Authorization
**Responsible:** LACRA + Exporters

### Process:
- Authorize transfer from agent warehouse to exporter warehouse
- Record transfer details and reference numbers
- Track commodity movement
- Update location in system

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/warehouse-transfer
{
  "referenceNumber": "EXP-123456-789",
  "transferDetails": {
    "fromWarehouse": "Agent Warehouse A",
    "toWarehouse": "Exporter Warehouse B", 
    "exporterId": "EXP-001",
    "quantity": 850
  }
}
```

---

## STEP 12: Exporter Warehouse Confirmation
**Responsible:** Exporters + LACRA & Eco Enviros

### Process:
- Confirm commodity arrival at exporter warehouse
- Joint inspection by LACRA and Eco Enviros
- Quality verification and documentation
- Sync data to exporter portal

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/warehouse-confirmation
{
  "batchCode": "BATCH-001",
  "inspectionDetails": {
    "exporterId": "EXP-001",
    "quantity": 850,
    "qualityGrade": "Grade A",
    "inspectorId": "INSP-MON-001"
  }
}
```

---

## STEP 13: Payment Processing
**Responsible:** Exporters

### Process:
- Process payment to licensed agents/buyers
- Calculate any late payment penalties
- Record payment details and dates
- Update system with payment confirmation

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/process-payment
{
  "agentId": "AGENT-001",
  "exporterId": "EXP-001",
  "paymentDetails": {
    "amount": 2500,
    "paymentDate": "2024-10-15", 
    "paymentMethod": "Bank Transfer"
  }
}
```

### Penalty System:
- 0-15 days: No penalty
- 16-30 days: Warning issued
- 31+ days: Account suspension

---

## STEP 14: EUDR Compliance Pack Generation
**Responsible:** LACRA System (Automated)

### Process:
- Generate comprehensive 6-certificate EUDR compliance pack
- Include all required documentation for EU export
- Create PDF with professional formatting
- Store in document management system

### Implementation:
```javascript
// API Endpoint: POST /api/agritrace/generate-eudr-pack
{
  "workflowId": 1,
  "packData": {
    "includesCertificates": [
      "Cover Page",
      "Export Eligibility Certificate",
      "Compliance Assessment Report", 
      "Deforestation Analysis Report",
      "Due Diligence Declaration",
      "Supply Chain Traceability Report"
    ]
  }
}
```

### Generated Documents:
- **Cover Page**: Summary and overview
- **Export Eligibility**: Official export authorization
- **Compliance Assessment**: EUDR Article 8 compliance verification
- **Deforestation Analysis**: Satellite data and risk assessment
- **Due Diligence**: Complete due diligence documentation
- **Supply Chain Traceability**: End-to-end traceability report

---

## Workflow Monitoring and Status

### Real-time Status Tracking:
```javascript
// API Endpoint: GET /api/agritrace/workflow/{workflowId}
// Returns complete workflow status including:
{
  "workflow": {
    "currentStage": "planning",
    "completedStages": 0,
    "totalStages": 14,
    "status": "active",
    "complianceScore": null
  },
  "events": [], // All workflow events
  "compliance": [], // Compliance records  
  "documents": [] // Generated documents
}
```

### Progress Calculation:
- Percentage Complete: (completedStages / totalStages) * 100
- Stage Progress: Current stage position in 14-step process
- Compliance Score: 0-100 based on EUDR requirements

---

## Database Integration

### Core Tables:
1. **agriTraceWorkflows** - Main workflow records
2. **agriTraceEvents** - All workflow events and actions
3. **agriTraceCompliance** - EUDR compliance records
4. **agriTraceDocuments** - Generated certificates and documents
5. **agriTraceQualityMetrics** - Quality assessment data
6. **agriTraceStages** - Individual stage tracking

### Real Data Example:
Current active workflow: "National Mapping Plan" (ID: 1)
- Status: Active since 2025-08-18
- Type: National mapping coordination
- Counties covered: All 15 Liberian counties
- Progress: Stage 1 of 14 (Planning phase)

---

## System Status: OPERATIONAL ✅

The AgriTrace workflow system is fully operational with:
- ✅ Real database integration
- ✅ API endpoints functional  
- ✅ Workflow tracking active
- ✅ EUDR compliance automation
- ✅ Professional dashboard interface
- ✅ Multi-portal access (Regulatory, Farmer, Exporter)

**Next Steps:** The system is ready for full deployment and can process farmer onboarding, track commodities through the complete supply chain, and generate EUDR compliance documentation automatically.