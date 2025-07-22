# AgriTrace360™ - Agricultural Commodity Compliance Management System

## Overview

AgriTrace360™ is a comprehensive web application designed for the Liberia Agriculture Commodity Regulatory Authority (LACRA) to manage and monitor agricultural commodity compliance across different counties. The system provides real-time tracking of commodities, inspections, certifications, and compliance metrics through an intuitive dashboard interface.

### Recent Updates (January 2025)
- **EUDR Compliance Integration**: Added EU Deforestation Regulation (EUDR) compliance dashboard with comprehensive monitoring, risk assessment, and documentation features
- **Farm Management Platform**: Complete integration of farmer onboarding, plot mapping, crop planning, input management, and procurement modules
- **Enhanced Navigation**: Dual-section navigation supporting both regulatory compliance and farm management workflows

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
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Location**: Shared schema definitions in `shared/schema.ts`

### Core Data Models
1. **Commodities**: Agricultural products with batch tracking, quality grades, and compliance status
2. **Inspections**: Quality control inspections with compliance assessments
3. **Certifications**: Export certificates and quality certifications
4. **Alerts**: System notifications and compliance alerts  
5. **Reports**: Generated compliance and operational reports
6. **Users**: System user management

### Frontend Components
- **Dashboard**: Real-time metrics, compliance charts, regional overviews, and EUDR compliance monitoring
- **EUDR Compliance**: Comprehensive EU Deforestation Regulation compliance dashboard with risk assessments, documentation tracking, and automated alerts
- **Farm Management Platform**: Complete suite of farmer onboarding, plot mapping, crop planning, input management, and procurement tools
- **Data Entry Forms**: Commodity registration, inspection recording, certification issuance
- **Data Tables**: Filterable and searchable lists for all data entities
- **Navigation**: Dual-section sidebar navigation with regulatory compliance and farm management modules

### API Structure
- **Dashboard endpoints**: `/api/dashboard/*` for metrics and analytics
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