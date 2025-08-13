# AgriTrace360™ - Agricultural Commodity Compliance Management System

## Overview
AgriTrace360™ is a comprehensive web application for the Liberia Agriculture Commodity Regulatory Authority (LACRA), designed to manage and monitor agricultural commodity compliance across Liberian counties. It provides real-time tracking of commodities, inspections, certifications, and compliance metrics through an intuitive dashboard. The system aims to enhance transparency, efficiency, and regulatory oversight in Liberia's agricultural sector, contributing to food safety, sustainable practices, and adherence to international standards like the EU Deforestation Regulation (EUDR). It offers multi-role access for regulatory staff, farmers, field agents, and exporters, streamlining workflows from farm to export. The project also encompasses an expanded "Polipus" platform with 8 specialized modules, including: Agricultural Traceability & Compliance, Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, and Carbon Trace.

## User Preferences
Preferred communication style: Simple, everyday language.
Maintenance Page Preference: Always use the generic maintenance page template (red gradient background, "Website Maintenance" title, no specific branding) for any maintenance page requests. This template is stored in server/index.ts as inline HTML.
Module Development Strategy: Ready to simultaneously develop all 7 new modules (Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, Carbon Trace) with complete functionality, maintaining consistent ISMS.online-inspired design system and professional standards from AgriTrace360. Will create full database schemas, backend APIs, frontend interfaces, and cross-module integration for each portal.

## Recent Changes (August 13, 2025)
- **CRITICAL BLANK PAGE ISSUE RESOLVED**: Fixed fundamental React mounting and component import issues that prevented platform visibility
- **APP COMPONENT ARCHITECTURE RESTORED**: Rebuilt App.tsx with proper routing structure and provider hierarchy
- **SIDEBAR COMPONENT COMPLETELY FIXED**: Replaced corrupted sidebar with clean version using proper React hooks
- **FRONT-PAGE JSX STRUCTURE REPAIRED**: Eliminated all syntax errors in front-page component that were breaking rendering
- **HTML ROOT ELEMENT OPTIMIZED**: Removed loading screen interference that was preventing React mounting
- **IMPORT ERROR RESOLUTION**: Fixed Vite compilation failures caused by non-existent component imports
- **REACT PROVIDER STRUCTURE STABILIZED**: Proper QueryClient and TooltipProvider setup without nesting conflicts
- **PLATFORM VISIBILITY FULLY RESTORED**: Complete Polipus Environmental Intelligence Platform now displaying all 8 modules correctly
- **ENHANCED PDF FUNCTIONALITY MAINTAINED**: EUDR and Deforestation reports remain fully functional with professional PDF generation
- **COMPREHENSIVE OFFLINE FUNCTIONALITY**: Field agent login works completely offline with test credentials (agent001/password123, agent002/password123, field001/password123)
- **ROBUST FARMER REGISTRATION**: Offline farmer registration with immediate display and automatic sync when connection returns
- **DEFORESTATION REPORT IMPLEMENTATION**: System automatically generates EUDR and Deforestation reports during farmer registration/mapping process with downloadable PDFs from farmer profiles

## Previous Changes (January 11, 2025)
- **MAXIMUM EFFICIENCY SATELLITE CONSTELLATION**: Expanded to 24 real satellites for comprehensive global environmental monitoring coverage
- **ADVANCED SATELLITE CATEGORIZATION**: Organized satellites into specialized categories (Earth Observation, Ocean/Climate, Weather, Radar, Commercial, Environmental, Altimetry, Next-Gen) with filtering capabilities
- **REAL-TIME SATELLITE MONITORING SYSTEM**: Built comprehensive satellite dashboard with live data from major space agencies (ESA, NASA, NOAA, DLR, ASI, Maxar, Planet Labs, Capella, ICEYE)
- **COMPREHENSIVE ENVIRONMENTAL DATA INTEGRATION**: Connected all 8 Polipus modules to satellite constellation for maximum monitoring efficiency
- **ENHANCED SATELLITE IMAGERY INTEGRATION**: Multiple high-resolution satellite providers with real-time data processing capabilities
- **PRECISION ENVIRONMENTAL MONITORING**: ±1.5m accuracy GPS systems with automated detection and comprehensive environmental analysis
- **SATELLITE MONITORING NAVIGATION**: Correctly positioned satellite monitoring button within Blue Carbon 360 portal sidebar menu for proper access control and user experience
- **PLATFORM CLEANUP & OPTIMIZATION**: Fixed all LSP diagnostics, removed unnecessary navigation elements, cleaned up field agent dashboard, and ensured optimal functionality across all modules

## System Architecture
The application employs a modern full-stack architecture with a clear separation of concerns.

### UI/UX Decisions
- **Design System**: An elegant and refined ISMS.online-inspired design system with a modern slate/blue color palette, large metric numbers, professional typography, clean white cards, colored icon backgrounds, and smooth hover transitions.
- **Branding**: Official LACRA and AgriTrace360 branding is integrated throughout, with EU logos for EUDR compliance sections.
- **Responsiveness**: Fully mobile-responsive design optimized for all devices, including a comprehensive Progressive Web App (PWA) with offline capabilities.
- **Dashboard Layouts**: Intuitive dashboards with real-time metrics, regional overviews, and specialized views for different user roles, featuring card-based designs with gradient colors for farmer dashboards.

### Technical Implementations
- **Frontend**: React (TypeScript), Wouter for routing, TanStack React Query for state management, shadcn/ui components (Radix UI primitives), Tailwind CSS for styling, and Vite for building.
- **Backend**: Node.js (Express.js) in TypeScript, featuring a RESTful API pattern.
- **Database**: PostgreSQL, managed with Drizzle ORM (PostgreSQL dialect) and Drizzle Kit for schema migrations.
- **Authentication**: A three-tier, role-based authentication system with separate portals for regulatory staff, farmers, field agents, and exporters, using JWT tokens and bcrypt for password hashing.
- **Geographic Integration**: Authentic Liberian geographic data, including all 15 counties, major cities, and transportation networks, integrated into the GIS mapping system. Comprehensive geolocation service with auto-detection of GPS coordinates, click-to-map functionality, and GPS-enhanced farmer registration.
- **Mobile Integration**: Complete Progressive Web App (PWA) implementation with comprehensive mobile standalone functionality, including offline-first architecture, service worker caching, and push notifications.
- **Messaging**: A comprehensive cross-portal internal messaging system with threading, role-based filtering, and notification indicators.
- **Reporting & Analytics**: Advanced statistics dashboards, audit trail monitoring, and comprehensive county agricultural reports with PDF download capabilities.
- **Simulation**: Real-time simulation system for commodities data.
- **Super Backend Control System**: Comprehensive administrative control system with PostgreSQL database integration, real-time system monitoring, feature flag management, and audit logging.
- **Central Control Center**: Enhanced administrative platform providing complete control over all platform aspects, including user management, data synchronization, security controls, GIS system control, mobile app management, vehicle and fleet tracking, and a comprehensive audit system.

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
- **Alerts**: Mobile app alert system for field agents and anonymous abuse reporting.
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