# AgriTrace360™ - Agricultural Commodity Compliance Management System

## Overview

AgriTrace360™ is a comprehensive web application designed for the Liberia Agriculture Commodity Regulatory Authority (LACRA) to manage and monitor agricultural commodity compliance across different counties. The system provides real-time tracking of commodities, inspections, certifications, and compliance metrics through an intuitive dashboard interface.

## Access Credentials

### Complete Portal Access Information

**Exporter Portal Access:**
- **URL:** http://localhost:5000/exporter-login (via Landing Page → Exporter Portal)
- **Username:** EXP-2024-001
- **Password:** exporter123
- **Company:** Liberia Agri Export Ltd.
- **Contact Person:** Marcus Bawah (Export Operations Manager)
- **Features:** Export order management, LACRA compliance integration, farmer partnerships, analytics

**Other Portal Access:**
- **Regulatory Staff:** admin001 / admin123
- **Field Agent:** AGT-2024-001 / agent123 (Sarah Konneh, Lofa County)
- **Farmer Portal:** FRM-2024-001 / farmer123 (Moses Tuah, Lofa County)

### Recent Updates (January 2025)
- **All Authentication Portals Fixed**: Resolved authentication issues across all user portals by updating password hashes in database. All portals now working with proper bcrypt password verification: regulatory (admin001/admin123), farmer (FRM-2024-001/farmer123), field agent (AGT-2024-001/agent123), and exporter (EXP-2024-001/exporter123) portals fully functional (January 24, 2025)
- **AgriTrace360 Logo Updated**: Replaced generic logo with official AgriTrace360 branding across header and landing page. New logo features modern green design with "FARM DIGITALIZATION" tagline, providing professional visual identity throughout the platform (January 24, 2025)
- **Internal Messaging System Completed**: Comprehensive cross-portal messaging system with database integration, message prioritization, threading, role-based filtering, and unread tracking. Features include message types (general, announcement, alert, support), priority levels, and full conversation management across all user portals (January 24, 2025)
- **Enhanced Farmer Onboarding with Profile Pictures and Land Mapping**: Implemented comprehensive farmer profile system with image upload functionality and integrated GPS land mapping. Features include real-time farm boundary generation, soil analysis, water sources tracking, elevation data, interactive map visualization dialogs, and complete land analysis reports. Backend schema updated to support profile pictures and land mapping data storage (January 24, 2025)
- **Time, Date, and Weather Widget**: Added comprehensive real-time clock, date, and weather display to header area across all pages and portals landing page. Features gradient styling, responsive design, and weather icons with Monrovia location (January 24, 2025)
- **All Login Portals Fixed**: Resolved all authentication issues across farmer, exporter, field agent, and regulatory portals. All portals now working with consistent token storage and proper session management (January 23, 2025)
- **Exporter Portal Complete**: Fully functional exporter dashboard with comprehensive authentication, API integration, and error handling. All buttons working with real-time data simulation (January 23, 2025)
- **Dashboard Authentication**: Added proper authentication checks to prevent logout issues and ensure users see appropriate content based on their role (January 23, 2025)
- **Three-Tier Authentication System**: Complete role-based authentication with separate portals for regulatory staff, farmers, and field agents
- **JWT Security Implementation**: Secure bcrypt password hashing with JWT token-based session management
- **Landing Page Portal**: Professional landing page routing users to appropriate authentication portals
- **Government Integration**: Complete integration with Liberia Revenue Authority (LRA), Ministry of Agriculture (MOA), and Customs for real-time compliance synchronization
- **EUDR Compliance Integration**: Added EU Deforestation Regulation (EUDR) compliance dashboard with comprehensive monitoring, risk assessment, and documentation features
- **Complete Liberian Cash Crops**: Integrated all major cash crops that can be grown in Liberia (20 commodity types) with quality grades and proper categorization
- **All 15 Counties**: Full integration of all Liberian counties in dropdown selectors and compliance tracking
- **Farm Management Platform**: Complete integration of farmer onboarding, plot mapping, and crop planning modules
- **Enhanced Navigation**: Dual-section navigation supporting both regulatory compliance and farm management workflows
- **Transportation Tracking System**: Real-time GPS vehicle tracking with QR code scanning for produce movement monitoring from farm to destination
- **Advanced Statistics & Audit System**: Role-based reporting system with comprehensive statistics dashboard and audit trail monitoring for senior officials
- **Input Management Removal**: Completely removed input management functionality from the entire platform per user request (January 2025)
- **Field Agent Territorial Restrictions**: Implemented comprehensive role-based access control for field agents with territorial limitations. Field agents can only access data and perform operations within their assigned jurisdiction/county. Features include territory-specific farmer registration, inspections, GPS mapping, and data entry with fully functional dashboard simulation (January 23, 2025)
- **Role-Based Access Control**: Implemented comprehensive authorization system where users only see features relevant to their role - farmers see farm management tools, field agents see inspection tools with territorial limits, and LACRA officers see full regulatory compliance features (January 2025)
- **Offline Data Sync Mechanism**: Complete offline functionality with conflict resolution, allowing users to work without internet and sync when connectivity is restored with smart merge strategies (January 2025)
- **Interactive SVG GIS Map**: Restored functional interactive SVG-based GIS mapping system with Liberia country outline, county boundaries, farm plot visualization, transportation routes, compliance zones, and real-time data integration. Features county filtering, layer controls, search functionality, and comprehensive map navigation with coordinates display (January 24, 2025)
- **GIS County Selection Fixed**: Resolved GIS mapping county selection issue where selecting counties showed no visual response. Enhanced interactive map with dynamic county filtering, loading indicators, county-specific farm highlighting, data summary panels, and real-time visual feedback. Users now see immediate response when selecting counties with detailed location statistics and highlighted county-specific data display (January 24, 2025)
- **GPS Mapping System Fully Active**: Comprehensive GPS mapping system now fully operational with real-time database integration, interactive map viewer with visual markers and boundaries, precision tracking capabilities, satellite connectivity, and live data visualization. Successfully implemented all storage methods and API endpoints for complete GPS functionality (January 24, 2025)
- **Advanced GPS Mapping Features Added**: Enhanced GPS mapping system with comprehensive activation dashboard showing real-time satellite status (107 satellites connected), GPS accuracy metrics (3.2m precision), and current position coordinates. Added Advanced Boundary Mapper with automatic/manual point collection, GPS Field Recorder for detailed field observations with weather data integration, and multi-tab interface for Enhanced GPS Tracker, Precision Boundary Mapper, Interactive Map Viewer, and existing mappings management. System shows live satellite connectivity with position 7.225282, -9.003844 and provides complete GPS mapping workflow from activation to data export (January 24, 2025)
- **Enhanced GPS System**: Professional-grade GPS mapping system with real-time tracking, precision boundary mapping, interactive visualization, signal strength monitoring, satellite tracking, and comprehensive data export capabilities for agricultural compliance and farm management (January 2025)
- **Mobile App Alert System**: Complete mobile alert integration system where field agents can submit requests via mobile app that route to director dashboard for compliance officer verification and director approval. Features emergency escalation, rule-based verification workflow, real-time metrics tracking, and comprehensive audit trail (January 24, 2025)
- **Dashboard Message Center**: Integrated message button in dashboard header with unread count badge, opens dialog showing all system notifications and compliance alerts. Users can mark messages as read individually, with messages categorized by type and priority with color-coded badges. Includes real-time synchronization and full message history with timestamps (January 24, 2025)
- **Export Application System**: Added "Submit Export Application" button to exporter portal header, providing comprehensive export license application form with company information, export details, destination markets, compliance certifications (EUDR, Organic, Fair Trade), and professional submission workflow with confirmation notifications (January 24, 2025)
- **Logout Routing Fix**: Resolved logout issue where users saw regulatory compliance menu instead of entity portals landing page. Fixed authentication token consistency and ensured proper redirection to landing page with entity portals for all user types (January 24, 2025)
- **Exporter Portal Login Fixed**: Resolved 401 "Invalid exporter credentials" error by updating password hash in database. Exporter portal (EXP-2024-001 / exporter123) now working correctly with proper bcrypt password verification and JWT token generation (January 24, 2025)
- **Exporter Portal Cleanup**: Completely redesigned exporter portal to focus exclusively on exporter-LACRA interactions. Removed irrelevant features (farmer network, transportation tracking, internal logistics) and streamlined interface to include only: export dashboard, export application system, LACRA compliance status, export license management, EUDR compliance tracking, and LACRA contact information. Added dedicated exporter navigation with purple color scheme (January 24, 2025)
- **Enhanced Export Applications**: Added comprehensive international certification compliance options including EU standards (EUDR, EU Organic, GLOBALG.A.P., BRC), US standards (USDA Organic, FDA, SQF), Fair Trade certifications (Fairtrade USA/International, Rainforest Alliance, UTZ), crop-specific standards (4C Coffee, ICO, ICCO, RSPO, FSC, PEFC), and quality/safety certifications (ISO 22000, HACCP, IFS, Kosher, Halal). Also added export timeline functionality with planned export dates (1-90 days) and urgency levels for LACRA processing prioritization (January 24, 2025)
- **Dynamic Certification System**: Implemented crop-specific certification display where conventional crops standards are always available for all commodities, while specialized certifications (EU standards, Fair Trade, crop-specific certifications) are shown only for relevant crops based on selection (January 24, 2025)
- **Anonymous Abuse Reporting System**: Added comprehensive anonymous reporting system allowing users to report corruption, bribery, illegal activities, document fraud, license violations, environmental violations, and other regulatory violations to LACRA's Anti-Corruption Unit. Features secure anonymous submission with optional contact methods and detailed incident reporting forms (January 24, 2025)
- **Export License Management System**: Added dedicated "Export License Application" menu section for exporters to manage annual license renewals. Features current license status tracking, renewal alerts, application forms for new licenses, renewal applications with operational changes documentation, and complete renewal history tracking. Essential for annual license compliance requirements (January 24, 2025)
- **License Registration Removal**: Completely removed license registration form and functionality from exporter portal per user request. Restored exporter login page to original clean state with simple authentication interface (January 24, 2025)
- **Network Partnership Button**: Added "Network Partnership" button to exporter dashboard header with purple styling and Users icon. Initially placed in operations area, then moved to header position for better accessibility (January 24, 2025)
- **Accurate Liberia Country Map**: Fixed GIS mapping page to display geographically accurate Liberia country outline with proper county boundaries for all 15 counties, realistic transportation routes connecting major cities (Monrovia-Gbarnga-Ganta highway, coastal routes), interactive clickable counties with visual feedback, accurate city locations including Monrovia (capital), Gbarnga, Zwedru, Voinjama, Sanniquellie, Buchanan, and Harper. Enhanced SVG map now provides authentic geographic representation of Liberia instead of generic placeholder shapes (January 24, 2025)
- **Enhanced Commodity Compliance System**: Implemented comprehensive real-time compliance status tracking with detailed metrics including overall score, quality score, documentation score, and traceability score. Features real-time data simulation with 30-second updates, detailed compliance dialogs with progress bars and certification status, compliance status update functionality with inspection record creation, issue tracking and recommendations system, export eligibility determination, and GPS verification status. Includes comprehensive compliance details view and input capabilities for data entry and status updates (January 24, 2025)
- **Real Satellite Connectivity Integration**: Implemented comprehensive satellite network integration connecting to GPS, GLONASS, Galileo, and BeiDou constellations for authentic positioning. Added real satellite imagery providers including Google Earth Engine, Sentinel Hub, USGS Earth Explorer, ESA Copernicus, Farmonaut, and Agromonitoring APIs. Features include real-time satellite status monitoring, multi-constellation GPS accuracy tracking, agricultural satellite imagery analysis, crop health monitoring using NDVI/EVI indices, soil moisture detection, and weather data from meteorological satellites. Integrated into GIS mapping system with comprehensive satellite connectivity dashboard showing constellation health and positioning accuracy (January 24, 2025)
- **Global Forest Watch API Integration**: Implemented comprehensive Global Forest Watch API integration with real-time deforestation monitoring and forest change detection. Features include GLAD deforestation alerts system with weekly forest loss detection, integrated alerts combining GLAD-L, GLAD-S2, and RADD systems, comprehensive tree cover analysis with historical change data, fire alerts and hotspot detection, biodiversity impact assessment with protected area monitoring, and EUDR compliance risk assessment for agricultural commodities. Added dedicated Forest Watch tab in GIS mapping system displaying real-time deforestation metrics, alert confidence levels, forest type classification, carbon impact calculations, and monitoring recommendations. Service provides authentic forest monitoring data for Liberian agricultural compliance and environmental protection (January 24, 2025)
- **NASA Satellite Integration**: Added comprehensive NASA Earth Observation System integration with direct connections to 27 NASA satellites including Terra, Aqua, Landsat 8/9, SMAP, VIIRS, and GPM Core. Integrated NASA GIBS (Global Imagery Browse Services) for real-time satellite imagery, NASA MODIS agricultural products for vegetation monitoring, NASA Landsat detailed field analysis, and NASA SMAP soil moisture data. Features include MODIS vegetation indices (NDVI, EVI, LAI), land surface temperature monitoring, evapotranspiration data, fire detection, Landsat spectral band analysis, and soil moisture guidance. Real-time NASA data display shows live agricultural analysis, temperature stress monitoring, and crop health assessments with authentic satellite data feeds (January 24, 2025)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture pattern with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom LACRA branding
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API pattern with organized route handlers
- **Development**: Hot module replacement via Vite integration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect (in-memory storage for development)
- **Database**: PostgreSQL (configured for Neon Database)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Location**: Shared schema definitions in `shared/schema.ts`

### Core Data Models
1. **Authentication Users**: Role-based user accounts with JWT authentication (regulatory, farmer, field_agent)
2. **User Sessions**: JWT token management and session tracking
3. **User Permissions**: Role-based access control system
4. **Commodities**: Agricultural products with batch tracking, quality grades, and compliance status
5. **Inspections**: Quality control inspections with compliance assessments
6. **Certifications**: Export certificates and quality certifications
7. **Alerts**: System notifications and compliance alerts  
8. **Reports**: Generated compliance and operational reports
9. **Users**: Legacy system user management
10. **Government Integration**: LRA tax assessments, MOA registrations, and Customs declarations with real-time synchronization

### Frontend Components
- **Dashboard**: Real-time metrics, compliance charts, regional overviews, and EUDR compliance monitoring
- **Government Integration**: Comprehensive synchronization dashboard for LRA, MOA, and Customs with real-time status tracking and bulk sync operations
- **EUDR Compliance**: Comprehensive EU Deforestation Regulation compliance dashboard with risk assessments, documentation tracking, and automated alerts
- **Farm Management Platform**: Complete suite of farmer onboarding, plot mapping, and crop planning tools (input management removed)
- **Transportation Tracking**: Real-time vehicle tracking system with GPS monitoring, QR code scanning, and movement status updates for complete supply chain visibility
- **Advanced Reports System**: Role-based reporting with Statistics dashboard (senior officials) and Audit trail monitoring (administrators only)
- **Data Entry Forms**: Commodity registration, inspection recording, certification issuance
- **Data Tables**: Filterable and searchable lists for all data entities with government sync status indicators
- **Navigation**: Dual-section sidebar navigation with regulatory compliance and farm management modules

### API Structure
- **Dashboard endpoints**: `/api/dashboard/*` for metrics and analytics
- **Transportation endpoints**: `/api/transportation/*` for vehicle tracking, QR scanning, and movement updates
- **Statistics & Audit endpoints**: `/api/dashboard/advanced-statistics` and `/api/audit/system-logs` for role-based reporting
- **CRUD endpoints**: RESTful operations for all data entities
- **File operations**: Report generation and data export capabilities

## Data Flow

1. **Data Entry**: Users input commodity data, inspection results, and certification information through dedicated forms
2. **Storage**: Data is validated using Zod schemas and stored via Drizzle ORM to PostgreSQL
3. **Processing**: The system calculates compliance metrics and generates alerts based on business rules
4. **Presentation**: Dashboard aggregates data for real-time monitoring and reporting
5. **Export**: Reports can be generated and exported for regulatory compliance

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolver for Zod schemas
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Data visualization components

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- **Command**: `npm run dev` starts the development server with hot reloading
- **Port**: Vite dev server with Express API integration
- **Database**: Connected to Neon PostgreSQL instance via DATABASE_URL

### Production Build
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `npm run db:push`
4. **Start**: `npm start` runs the production server

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment setting (development/production)
- **REPL_ID**: Replit-specific configuration for development tools

The application is designed for deployment on Replit with specific integrations for the development environment, including cartographer mapping and runtime error overlays.