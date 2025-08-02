# AgriTrace360™ - Agricultural Commodity Compliance Management System

## Overview

AgriTrace360™ is a comprehensive web application for the Liberia Agriculture Commodity Regulatory Authority (LACRA), designed to manage and monitor agricultural commodity compliance across Liberian counties. It provides real-time tracking of commodities, inspections, certifications, and compliance metrics through an intuitive dashboard. The system aims to enhance transparency, efficiency, and regulatory oversight in Liberia's agricultural sector, contributing to food safety, sustainable practices, and adherence to international standards like the EU Deforestation Regulation (EUDR). It offers multi-role access for regulatory staff, farmers, field agents, and exporters, streamlining workflows from farm to export.

## User Preferences

Preferred communication style: Simple, everyday language.

## Main Landing Page Configuration (CONFIRMED & CLEANED)
- **PRIMARY HOMEPAGE**: Main landing page displays Polipus logo with 8 modules and login buttons
- **DEFAULT ROUTE**: Root path (/) serves FrontPage component with Polipus branding
- **CLEAN SYSTEM STATUS**: Deep system cleanup completed - cache cleared, processes restarted
- **MODULE STRUCTURE**: 8 distinct modules confirmed:
  1. Agricultural Traceability & Compliance (ACTIVE - provides login access)
  2. Supply Chain Management  
  3. Compliance & Certification
  4. Analytics & Reporting
  5. Enhanced GIS Mapping
  6. User Management
  7. Document Management
  8. System Configuration
- **ACCESS POINTS**: Multiple routes (/front-page, /home, /main, /index) all point to Polipus main landing page
- **LOGIN ACCESS**: Through Agricultural Traceability module → /landing → portal login options
- **MONITORING PORTAL FIX**: Login flow fixed - monitoring users now stay in monitoring dashboard after login

## System Architecture

The application employs a modern full-stack architecture with a clear separation of concerns.

### UI/UX Decisions
- **Design System**: Implemented an elegant and refined ISMS.online-inspired design system across the entire platform. This includes a modern slate/blue color palette, large metric numbers with professional typography, clean white cards with subtle shadows, colored icon backgrounds, and smooth hover transitions.
- **Branding**: Official LACRA branding is integrated throughout the platform, including logos and portal titles, along with AgriTrace360 branding. EU logos are incorporated for EUDR compliance sections.
- **Responsiveness**: Fully mobile-responsive design optimized for all devices, including a comprehensive Progressive Web App (PWA) with offline capabilities and native app-like experience.
- **Dashboard Layouts**: Intuitive dashboards with real-time metrics, regional overviews, and specialized views for different user roles. Farmer dashboards feature a card-based design with gradient colors.

### Technical Implementations
- **Frontend**: Built with React (TypeScript), using Wouter for routing, TanStack React Query for state management, shadcn/ui components (Radix UI primitives), Tailwind CSS for styling, and Vite for building.
- **Backend**: Developed with Node.js (Express.js) in TypeScript, featuring a RESTful API pattern.
- **Database**: PostgreSQL, managed with Drizzle ORM (PostgreSQL dialect) and Drizzle Kit for schema migrations. Uses JWT tokens and bcrypt for authentication.
- **Authentication**: A three-tier, role-based authentication system with separate portals for regulatory staff, farmers, field agents, and exporters. Includes JWT token-based session management and secure bcrypt password hashing.
- **Geographic Integration**: Authentic Liberian geographic data, including all 15 counties, major cities, and transportation networks, is integrated into the GIS mapping system.
- **Mobile Integration**: Complete Progressive Web App (PWA) implementation with comprehensive mobile standalone functionality. Features automatic installation prompts, offline-first architecture, service worker caching, background sync, push notifications, custom app icons, platform-specific installation guides, and native app-like experience. Includes PWA-enabled protection page for secure deployment.
- **Messaging**: A comprehensive cross-portal internal messaging system with threading, role-based filtering, unread tracking, and blinking red notification indicators.
- **Reporting & Analytics**: Advanced statistics dashboards, audit trail monitoring, and comprehensive county agricultural reports with PDF download capabilities.
- **Simulation**: Real-time simulation system for commodities data, demonstrating dynamic compliance rates and updates.
- **Super Backend Control System**: Comprehensive administrative control system with PostgreSQL database integration (8 specialized tables), real-time system monitoring, feature flag management, emergency controls, performance metrics collection, audit logging, background health checks, and professional monitoring portal interface. Accessible at /super-backend and /monitor endpoints with complete system oversight capabilities.
- **Central Control Center**: Enhanced administrative platform providing complete control over all platform aspects, including user management, data synchronization, security controls, system maintenance, and emergency operations. Features real-time metrics, tabbed interface, and comprehensive platform management tools. Now includes GIS system control (satellite imagery, GPS tracking, deforestation alerts, map optimization), mobile app management (push notifications, version control, offline mode, background sync), vehicle and fleet tracking controls for real-time monitoring and route optimization, and comprehensive audit system for independent audit compliance. The audit system tracks all user activities, decision-making processes, communications (internal messages, audio/video), financial transactions, input data, and system responses, providing complete transparency for regulatory compliance and independent audits. Accessible at /central-control endpoint.

### Feature Specifications
- **Core Modules**: Export order management, LACRA compliance integration, farmer partnerships, analytics, inspection management, certification issuance.
- **Compliance Monitoring**: Real-time compliance status tracking with detailed metrics (overall, quality, documentation, traceability scores), issue tracking, and recommendations.
- **EUDR Compliance**: Dedicated dashboard for the EU Deforestation Regulation, including risk assessments, documentation, and automated alerts, with action buttons for report generation, certificate export, satellite monitoring data, and risk assessment scheduling.
- **Farm Management**: Farmer onboarding, GPS land mapping (boundary generation, soil analysis, water sources), crop planning, and profile management with image uploads.
- **GIS Mapping**: Interactive SVG/Leaflet-based GIS mapping with Liberia country outline, county boundaries, farm plot visualization, real-time satellite monitoring (Sentinel-2, Landsat-8), GPS tracking, and deforestation alerts (Global Forest Watch API, NASA Earth Observation System).
- **Supply Chain Visibility**: Real-time GPS vehicle tracking and QR code scanning for produce movement from farm to destination.
- **International Standards**: Integration of international certification standards (EU, US, Fair Trade, crop-specific, quality/safety) for export applications.
- **Access Control**: Comprehensive role-based access control (RBAC), including territorial restrictions for field agents and restricted access to sensitive features (GIS mapping, crop planning) for regulatory staff only.
- **Offline Functionality**: Offline data synchronization mechanism with conflict resolution for users without internet connectivity.
- **Alerts**: Mobile app alert system for field agents to submit requests to the director dashboard. Anonymous abuse reporting system for integrity violations.
- **Export System**: Comprehensive export permit submission and license management system for exporters, including certificate attachments and renewal processes.
- **System Testing**: Comprehensive testing system integrated into the monitoring dashboard for automated validation of all website functionality.

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
- **Global Forest Watch API**: Deforestation monitoring and forest change detection.
- **NASA Earth Observation System**: Integration with NASA satellites (Terra, Aqua, Landsat, SMAP, VIIRS, GPM Core) for agricultural products, vegetation indices, and soil moisture data.
- **OpenStreetMap data (via Leaflet)**: Real interactive mapping.
- **REST Countries API**: Authentic country geographic data.
- **Sentinel-2 and Landsat-8 (indirect via imagery providers)**: Satellite imagery for environmental monitoring.
- **Google Earth Engine, Sentinel Hub, USGS Earth Explorer, ESA Copernicus, Farmonaut, Agromonitoring APIs**: Real satellite imagery providers.