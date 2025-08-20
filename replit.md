# Polipus Platform - Comprehensive Environmental Intelligence Ecosystem

## Overview
The Polipus Platform is the world's first comprehensive environmental intelligence ecosystem, integrating 8 specialized modules with unprecedented precision and capability. This revolutionary platform combines real-time satellite monitoring (200+ satellites), GPS technology, blockchain traceability, and AI-powered analytics to deliver unmatched environmental intelligence across agricultural, mining, forestry, marine, and carbon monitoring sectors. The platform includes AgriTrace360™ as its primary agricultural module, working alongside Live Trace (livestock), Land Map360 (land mapping), Mine Watch (mining oversight), Forest Guard (forest protection), Aqua Trace (marine monitoring), Blue Carbon 360 (marine conservation economics), and Carbon Trace (environmental monitoring). The system serves environmental agencies, agricultural stakeholders, mining authorities, forestry departments, marine conservation organizations, carbon traders, regulatory bodies, and international compliance organizations with unprecedented accuracy and reliability.

## User Preferences
Preferred communication style: Simple, everyday language.
Maintenance Page Preference: Always use the generic maintenance page template (red gradient background, "Website Maintenance" title, no specific branding) for any maintenance page requests. This template is stored in server/index.ts as inline HTML.
Module Development Strategy: Ready to simultaneously develop all 7 new modules (Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, Carbon Trace) with complete functionality, maintaining consistent ISMS.online-inspired design system and professional standards from AgriTrace360. Will create full database schemas, backend APIs, frontend interfaces, and cross-module integration for each portal.
PDF Report Design Preference: User confirmed satisfaction with enhanced professional design approach featuring comprehensive charts, graphs, and visual elements. Prefers clean synchronized formatting with advanced data visualizations including radar charts, 3D pie charts, bar charts with benchmarks, and timeline flow diagrams across all 6 certificates. Recently updated to use UniDOC-inspired professional style with dashboard-style metrics, color-coded risk indicators, progress bars, and network diagrams as shown in reference image.

## System Architecture
The application employs a modern full-stack architecture with a clear separation of concerns.

### Recent Updates (August 20, 2025)
- **HARVESTING SCHEDULE MANAGEMENT COMPLETE**: Successfully implemented comprehensive harvest management functionality including harvest status tracking (ready_for_harvest, harvesting, harvested), harvest action buttons (Start Harvest, Complete Harvest), and automated workflow progression from planting to sale.
- **FARMER-BUYER TRANSACTION CONNECTIVITY COMPLETE**: Built complete farmer-buyer product transaction system upon harvesting with transaction creation, approval workflow, negotiation interface, payment terms management, and delivery tracking. Farmers can now directly sell to buyers with full transaction history and status tracking.
- **COMPREHENSIVE FARMER PORTAL FUNCTIONALITY**: Enhanced farmer dashboard with 7 comprehensive tabs including Overview, Land Mappings, Harvest Schedules, Marketplace, Transactions, Buyer Inquiries, and Alerts. Complete integration from farm inspector onboarding → farmer portal access → harvest management → buyer transactions.
- **PLATFORM DOCUMENTATION PDF CORRECTED**: Fixed discrepancy where documentation was advertised as 24 pages but only generating 16 pages. Added comprehensive additional content including shipping integrations, satellite data sources, AI/ML capabilities, blockchain features, mobile capabilities, training programs, regulatory compliance, and future roadmap to reach full 24 pages as advertised.
- **SHIPPING API INTEGRATION COMPLETE**: Successfully created comprehensive shipping integration service connecting to Maersk, MSC, CMA CGM, and Hapag-Lloyd APIs. Implemented real-time container tracking, vessel monitoring, and shipment status capabilities in exporter portal with dedicated shipping tracking page.
- **DOCUMENTATION ACCESS OPTIMIZED**: Removed platform documentation PDF window from all AgriTrace 360 access portals as requested, keeping it available only on the front page to maintain clean portal access without documentation interruptions.

### Previous Updates (August 20, 2025)
- **BREAKTHROUGH: Exporter Authentication System Fixed**: Successfully resolved exporter login credential authentication issues. Fixed authenticateExporter method in storage.ts to work with the existing exporters table schema instead of separate credentials table. Working credentials: EXP-20250818-627 / Demo2025!Export.
- **DDGOTS Exporter Management System Fully Operational**: Completed debugging and testing of the three-tier regulatory portal system. DDGOTS (Deputy Director General Operations & Technical Services) can now successfully onboard exporters, generate credentials, and manage the complete exporter approval workflow.
- **Cross-Portal Authentication Integration**: Established seamless authentication flow between regulatory portals and exporter portal access, enabling proper credential validation and role-based access control across all three departments (DG, DDGOTS, DDGAF).

### Previous Updates (August 19, 2025)
- **Three-Tier LACRA Regulatory Portal System**: Implemented comprehensive departmental separation with DG (Director General), DDGOTS (Deputy Director General Operations & Technical Services), and DDGAF (Deputy Director General Administration & Finance) portals, each with specialized authentication and permissions.
- **Departmental Dashboard Integration**: Successfully added all three regulatory dashboards to App.tsx routing system with proper route protection and department-specific functionality distribution.
- **DG Portal Oversight Implementation**: Enhanced Director General dashboard with comprehensive "Portal Oversight" tab providing read-only visibility across all departmental activities including Inspector Management, Buyer Management, Exporter Management systems under DDGOTS, and Payment Validation, Financial Records under DDGAF.
- **DDGOTS Management System Navigation Fixed**: Resolved 404 routing errors by correcting navigation paths to include `/regulatory/` prefix for all three management systems (Inspector, Buyer, Exporter Management).
- **DDGOTS Onboarding Responsibilities Established**: DDGOTS department now manages the complete onboarding workflow for three key user types: Inspectors (both Land and Port), Buyers (commodity purchasers), and Exporters (export license holders), with full credential generation and portal access management.
- **LSP Error Resolution**: Fixed all TypeScript errors in buyer-management.tsx and exporter-management.tsx related to apiRequest function calls and parameter mismatches.
- **Permission-Based Access Control**: Established proper permission distribution where DG has strategic oversight and final approvals, DDGOTS manages operational systems (Inspector/Buyer/Exporter management), and DDGAF handles financial validation and account management.
- **Preserved Existing Functionality**: Successfully maintained all existing regulatory portal functionality while redistributing it among the three departments without deletion, ensuring seamless operational continuity.
- **BREAKTHROUGH: Complete Buyer & Exporter Management System Fix**: Successfully resolved critical backend issues preventing registration and credential generation. Fixed database schema constraints, foreign key references, and API data type mismatches. Both buyer and exporter registration, approval, and credential generation now fully functional with proper error handling and database integrity.
- **AGRICULTURAL BUYER PORTAL REDESIGN (Latest)**: Completely redesigned buyer portal from regulatory focus to agricultural commerce functionality. Removed all irrelevant regulatory permissions and implemented proper farmer-harvest connections, exporter networks, transaction dashboard, and business metrics. Fixed navigation to show "Agricultural Buyer Portal" instead of "DG Strategic Oversight" by clearing regulatory tokens during buyer login.

### UI/UX Decisions
- **Design System**: An elegant and refined ISMS.online-inspired design system with a modern slate/blue color palette, large metric numbers, professional typography, clean white cards, colored icon backgrounds, and smooth hover transitions. Official LACRA and AgriTrace360 branding is integrated throughout, with EU logos for EUDR compliance sections.
- **Responsiveness**: Fully mobile-responsive design optimized for all devices, including a comprehensive Progressive Web App (PWA) with offline capabilities.
- **Dashboard Layouts**: Intuitive dashboards with real-time metrics, regional overviews, and specialized views for different user roles, featuring card-based designs with gradient colors for farmer dashboards.

### Technical Implementations
- **Frontend**: React (TypeScript), Wouter for routing, TanStack React Query for state management, shadcn/ui components (Radix UI primitives), Tailwind CSS for styling, and Vite for building.
- **Backend**: Node.js (Express.js) in TypeScript, featuring a RESTful API pattern.
- **Database**: PostgreSQL, managed with Drizzle ORM (PostgreSQL dialect) and Drizzle Kit for schema migrations.
- **Authentication**: A comprehensive multi-tier, role-based authentication system with separate portals for regulatory staff, farmers, two-tier inspector system (Land & Port Inspectors), buyers, and exporters, using JWT tokens and bcrypt for password hashing.
- **Geographic Integration**: Authentic Liberian geographic data, including all 15 counties, major cities, and transportation networks, integrated into the GIS mapping system. Comprehensive geolocation service with auto-detection of GPS coordinates, click-to-map functionality, and GPS-enhanced farmer registration.
- **Mobile Integration**: Complete Progressive Web App (PWA) implementation with comprehensive mobile standalone functionality, including offline-first architecture, service worker caching, and push notifications.
- **Messaging**: A comprehensive cross-portal internal messaging system with threading, role-based filtering, and notification indicators.
- **Payment Processing**: Comprehensive revenue-sharing payment system with Stripe integration, supporting multiple payment methods including mobile money, bank transfers, and international cards with automatic LACRA-Polipus revenue distribution.
- **Reporting & Analytics**: Advanced statistics dashboards, audit trail monitoring, and comprehensive county agricultural reports with PDF download capabilities.
- **Simulation**: Real-time simulation system for commodities data.
- **Super Backend Control System**: Comprehensive administrative control system with PostgreSQL database integration, real-time system monitoring, feature flag management, and audit logging, providing complete control over all platform aspects.

### Feature Specifications
- **Core Modules**: Export order management, LACRA compliance integration, farmer partnerships, analytics, inspection management, certification issuance.
- **Compliance Monitoring**: Real-time compliance status tracking with detailed metrics, issue tracking, and recommendations.
- **EUDR Compliance**: Dedicated dashboard for the EU Deforestation Regulation, including risk assessments, documentation, and automated alerts.
- **Farm Management**: Farmer onboarding with automatic GPS detection, interactive land mapping, crop planning, and profile management.
- **GIS Mapping**: Interactive SVG/Leaflet-based GIS mapping with Liberia country outline, county boundaries, farm plot visualization, real-time satellite monitoring, GPS tracking, and deforestation alerts.
- **Supply Chain Visibility**: Real-time GPS vehicle tracking and QR code scanning for produce movement.
- **International Standards**: Integration of international certification standards for export applications.
- **Access Control**: Comprehensive role-based access control (RBAC), including territorial restrictions and restricted access to sensitive features.
- **Offline Functionality**: Offline data synchronization mechanism with conflict resolution.
- **Alerts**: Mobile app alert system for inspectors and anonymous abuse reporting.
- **Export System**: Comprehensive export permit submission and license management system for exporters.
- **System Testing**: Comprehensive testing system integrated into the monitoring dashboard for automated validation.

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
- **NASA Earth Observation System**: Integration with NASA satellites for agricultural products and data.
- **OpenStreetMap data (via Leaflet)**: Real interactive mapping.
- **REST Countries API**: Authentic country geographic data.
- **Sentinel-2 and Landsat-8 (indirect via imagery providers)**: Satellite imagery for environmental monitoring.
- **Google Earth Engine, Sentinel Hub, USGS Earth Explorer, ESA Copernicus, Farmonaut, Agromonitoring APIs**: Real satellite imagery providers.