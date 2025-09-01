# Polipus Platform - Environmental Intelligence Ecosystem

## Overview
The Polipus Platform is a comprehensive environmental intelligence ecosystem, integrating 8 specialized modules for precise monitoring across agricultural, mining, forestry, marine, and carbon sectors. It leverages real-time satellite monitoring, GPS technology, blockchain traceability, and AI-powered analytics. Key modules include AgriTrace360™ for agriculture, alongside Live Trace (livestock), Land Map360 (land mapping), Mine Watch (mining oversight), Forest Guard (forest protection), Aqua Trace (marine monitoring), Blue Carbon 360 (marine conservation economics), and Carbon Trace (environmental monitoring). The platform aims to provide unparalleled accuracy and reliability to environmental agencies, agricultural stakeholders, mining authorities, forestry departments, marine conservation organizations, carbon traders, regulatory bodies, and international compliance organizations.

## User Preferences
Preferred communication style: Simple, everyday language.
Maintenance Page Preference: Always use the generic maintenance page template (red gradient background, "Website Maintenance" title, no specific branding) for any maintenance page requests. This template is stored in server/index.ts as inline HTML.
Module Development Strategy: Ready to simultaneously develop all 7 new modules (Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, Carbon Trace) with complete functionality, maintaining consistent ISMS.online-inspired design system and professional standards from AgriTrace360. Will create full database schemas, backend APIs, frontend interfaces, and cross-module integration for each portal.
System Administrator Preference: Modular administrative structure where AgriTrace has its own limited system administrative activity, separate from the broader Polipus platform. Each module should have limited system administrative activity rather than platform-wide control.
AgriTrace Admin Portal Implementation: Successfully implemented dedicated standalone AgriTrace System Administrator portal (August 2025) with completely isolated interface, no sidebar/header from main platform, limited scope functionality showing only agricultural traceability controls, restrictions clearly displayed, and proper authentication flow working correctly.
PDF Report Design Preference: User confirmed satisfaction with enhanced professional design approach featuring comprehensive charts, graphs, and visual elements. Prefers clean synchronized formatting with advanced data visualizations including radar charts, 3D pie charts, bar charts with benchmarks, and timeline flow diagrams across all 6 certificates. Recently updated to use UniDOC-inspired professional style with dashboard-style metrics, color-coded risk indicators, progress bars, and network diagrams as shown in reference image.
Land Mapping Restriction: Farmers cannot map new plots - this functionality is exclusively restricted to Land Inspectors through the official land mapping system.
Crop Scheduling Focus: Farmers should focus on crop scheduling, harvest management, and buyer connections rather than land mapping activities.
Automatic Batch Code Generation: When farmers mark crops as harvested, the system automatically generates batch codes and notifies all stakeholders (Land Inspector, Warehouse Inspector, three-tier regulatory panels). Farmers do NOT manually generate batch codes - this is completely automated upon harvest completion.

## System Architecture
The application employs a modern full-stack architecture with a clear separation of concerns.

### UI/UX Decisions
The design system is ISMS.online-inspired, featuring a modern slate/blue color palette, professional typography, clean white cards, and smooth transitions. It integrates LACRA and AgriTrace360 branding, with EU logos for EUDR compliance. The design is fully mobile-responsive, optimized for all devices, and includes a Progressive Web App (PWA) with offline capabilities. Intuitive dashboards with real-time metrics and specialized views feature card-based designs with gradient colors.

### Technical Implementations
- **Frontend**: React (TypeScript), Wouter for routing, TanStack React Query for state management, shadcn/ui components (Radix UI primitives), Tailwind CSS for styling, and Vite for building.
- **Backend**: Node.js (Express.js) in TypeScript, featuring a RESTful API pattern.
- **Database**: PostgreSQL, managed with Drizzle ORM and Drizzle Kit for schema migrations.
- **Authentication**: A comprehensive multi-tier, role-based authentication system with separate portals for regulatory staff, farmers, inspectors, buyers, and exporters, using JWT tokens and bcrypt.
- **Geographic Integration**: Authentic Liberian geographic data (counties, cities, transportation) integrated into the GIS mapping system with GPS-enhanced farmer registration.
- **Mobile Integration**: Complete PWA implementation with offline-first architecture, service worker caching, and push notifications.
- **Messaging**: A comprehensive cross-portal internal messaging system with threading and role-based filtering.
- **Payment Processing**: Comprehensive revenue-sharing payment system with Stripe integration, supporting multiple payment methods and automatic revenue distribution.
- **Reporting & Analytics**: Advanced statistics dashboards, audit trail monitoring, and comprehensive county agricultural reports with PDF download capabilities.
- **Simulation**: Real-time simulation system for commodities data.
- **Super Backend Control System**: Comprehensive administrative control system with PostgreSQL integration, real-time system monitoring, feature flag management, and audit logging.
- **Performance Optimization**: Implemented comprehensive lazy loading and code splitting to significantly reduce initial bundle size and improve page load times.
- **Independent Portal System**: Enhanced System Administrator Portal and Regulatory Portal (Classic) as independent alternatives, integrated into the regulatory login page with proper authentication.
- **Harvesting & Transaction Management**: Comprehensive harvest management (tracking, actions) and farmer-buyer product transaction system (creation, approval, negotiation, payment, delivery).
- **Farmer Portal Functionality**: Enhanced farmer dashboard with comprehensive tabs including Overview, Land Mappings, Harvest Schedules, Marketplace, Transactions, Buyer Inquiries, and Alerts.
- **Shipping Integration**: Comprehensive shipping integration service connected to Maersk, MSC, CMA CGM, and Hapag-Lloyd APIs for real-time container tracking.
- **Exporter Management**: Fully operational DDGOTS Exporter Management System for onboarding, credential generation, and approval workflow.
- **Cross-Portal Authentication**: Seamless authentication flow between regulatory portals and exporter portal.
- **Three-Tier Regulatory Portal**: Implemented comprehensive departmental separation (DG, DDGOTS, DDGAF) with specialized authentication and permissions, including departmental dashboards and oversight functionalities.
- **Buyer & Exporter Management System**: Fully functional registration, approval, and credential generation with proper error handling and database integrity.
- **Agricultural Buyer Portal Redesign**: Redesigned buyer portal focusing on agricultural commerce functionality, farmer-harvest connections, exporter networks, and transaction dashboards.
- **Comprehensive Crop Scheduling System**: Complete farmer-focused crop management system with planting schedules, harvest tracking, marketplace listing creation, and buyer connection workflows. Includes dedicated "Crop Scheduling" tab in farmer dashboard with advanced management features.
- **Farmer Portal Land Mapping Restriction**: Removed "Map New Plot" functionality from farmer portal, restricting land mapping exclusively to Land Inspector portal through official land mapping system.
- **Complete 18-Point Integration System**: End-to-end agricultural traceability workflow from farm to export documentation: (1) Land Inspector EUDR compliance data to DDGOTS, (2) Warehouse QR batch approval system, (3) Automatic harvest buyer notifications, (4) First-come-first-serve lot proposal system, (5) Payment confirmation workflow routing to DDG-AF for audit, (6) Warehouse delivery registration with quality inspection and compliance verification, (7) Warehouse product registration with 30-day storage limit and buyer notifications, (8) Buyer marketplace listing system for exporter connectivity, (9) Exporter proposal response system with accept/reject functionality, (10) Land Inspector authorization for export transfers, (11) Buyer warehouse delivery code generation and stakeholder notifications, (12) Exporter warehouse product receipt with QR verification and registration under Exporter ID, (13) Exporter payment to buyer with 7-day window and DDG-AF/DDGOTS audit notifications, (14) Port Inspector assignment for final quality checks and export compliance, (15) Port inspection with fumigation validation and export standard compliance, (16) DDGOTS inspection verification and processing fee calculation, (17) Exporter processing fee payment to DDG-AF with receipt verification, (18) DDG-AF payment confirmation and DDGOTS document release approval with dashboard download access.
- **DG Level (Director General) Authority Implementation**: Highest regulatory authority with final approval power over export permits and licenses after DDGOTS review, complete read-only oversight across all 8 portals (Farmers, Buyers, Exporters, Inspectors), comprehensive system dashboard, and full audit capabilities. Successfully implemented with authentication (dg.admin/dg123), JWT-based security, and complete workflow integration.
- **AgriTrace Standalone Admin Portal**: Completely independent system administrator portal for AgriTrace360™ module only, with dedicated authentication (agritrace.admin/agritrace123/AGRITRACE2025), standalone interface without main platform sidebar/header, limited administrative scope restricted to agricultural traceability functions only, proper restriction warnings, and complete isolation from Polipus platform controls.
- **Integrated Certificate Generation System**: Complete certificate management system integrated into AgriTrace dashboards with dropdown interfaces for Port Inspector (Phytosanitary, Certificate of Origin, Quality Control) and Director for Operations (Compliance Declaration). Features professional PDF generation with QR codes, form-based data entry, and preserves all existing approved certificate designs. Auto-generated certificates (EUDR, Deforestation) connect directly to farmer GPS/database system for real-time data population.

### Feature Specifications
Core modules include export order management, LACRA compliance, farmer partnerships, analytics, inspection management, and certification issuance. Features also include real-time compliance status tracking, EUDR compliance dashboard, farmer onboarding with interactive land mapping, GIS mapping with satellite monitoring and deforestation alerts, supply chain visibility (GPS tracking, QR scanning), international standards integration, comprehensive role-based access control (RBAC), offline data synchronization, mobile app alert system, export permit submission, and integrated system testing.

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database interactions
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Zod schema resolver for form validation
- **zod**: Runtime type validation and schema definition

### UI Libraries
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Data visualization components

### Geographic & Satellite APIs
- **Global Forest Watch API**: Deforestation monitoring.
- **NASA Earth Observation System**: Satellite data for agricultural products.
- **OpenStreetMap data (via Leaflet)**: Interactive mapping.
- **REST Countries API**: Country geographic data.
- **Satellite imagery providers**: (indirect via imagery providers) Sentinel-2 and Landsat-8.
- **Google Earth Engine, Sentinel Hub, USGS Earth Explorer, ESA Copernicus, Farmonaut, Agromonitoring APIs**: Real satellite imagery providers.