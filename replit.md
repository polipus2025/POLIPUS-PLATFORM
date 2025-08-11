# AgriTrace360™ - Agricultural Commodity Compliance Management System

## Overview
Polipus™ is the world's most advanced environmental monitoring and certification platform, designed to be the first comprehensive solution for global environmental compliance and sustainability tracking. The platform revolutionizes environmental oversight through cutting-edge technology, real-time satellite monitoring, and AI-powered analytics across 8 specialized modules. Built to exceed industry expectations, Polipus provides unprecedented transparency, efficiency, and regulatory oversight for environmental protection, contributing to global sustainability goals and adherence to international standards including EU Deforestation Regulation (EUDR), Paris Climate Agreement, and UN Sustainability Goals. The platform offers multi-stakeholder access for regulatory authorities, environmental scientists, field agents, corporations, and international organizations, streamlining workflows from environmental monitoring to global certification. The comprehensive system includes: Agricultural Traceability & Compliance (LACRA), Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, and Carbon Trace - each featuring advanced satellite monitoring, AI analytics, and real-time environmental data processing.

## User Preferences
Excellence Standard: Building the first and most advanced environmental monitoring and certification platform globally - always deliver best-in-class solutions that exceed expectations.
Preferred communication style: Professional, technical excellence focus with clear action-oriented updates.
Maintenance Page Preference: Always use the generic maintenance page template (red gradient background, "Website Maintenance" title, no specific branding) for any maintenance page requests. This template is stored in server/index.ts as inline HTML.
Module Development Strategy: Developing world-class environmental monitoring platform with all 8 modules featuring cutting-edge technology, real-time satellite integration, AI-powered analytics, and comprehensive environmental certification capabilities. Each module built to international standards with full database schemas, advanced APIs, sophisticated frontend interfaces, and seamless cross-module integration for maximum environmental monitoring efficiency.

## Recent Changes (January 11, 2025)
- **MAXIMUM EFFICIENCY SATELLITE CONSTELLATION**: Expanded to 24 real satellites for comprehensive global environmental monitoring coverage
- **ADVANCED SATELLITE CATEGORIZATION**: Organized satellites into specialized categories (Earth Observation, Ocean/Climate, Weather, Radar, Commercial, Environmental, Altimetry, Next-Gen) with filtering capabilities
- **REAL-TIME SATELLITE MONITORING SYSTEM**: Built comprehensive satellite dashboard with live data from major space agencies (ESA, NASA, NOAA, DLR, ASI, Maxar, Planet Labs, Capella, ICEYE)
- **COMPREHENSIVE ENVIRONMENTAL DATA INTEGRATION**: Connected all 8 Polipus modules to satellite constellation for maximum monitoring efficiency
- **WORLD-CLASS PLATFORM ARCHITECTURE**: Elevated platform to international standards for advanced environmental monitoring and certification
- **ENHANCED SATELLITE IMAGERY INTEGRATION**: Multiple high-resolution satellite providers with real-time data processing capabilities
- **PRECISION ENVIRONMENTAL MONITORING**: ±1.5m accuracy GPS systems with automated detection and comprehensive environmental analysis
- **GLOBAL CERTIFICATION READINESS**: Platform positioned as first advanced environmental monitoring solution meeting international standards

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