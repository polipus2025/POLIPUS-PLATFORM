# AgriTrace360™ System Administrator Access

## Overview
The AgriTrace360™ module now has its own dedicated system administrator with limited administrative activity, separate from the broader Polipus platform. This modular approach ensures each module maintains its own controlled administrative scope.

## AgriTrace System Administrator Credentials

### **Access Information:**
- **System Access Code:** `AGRITRACE2025`
- **Admin Usernames & Passwords:**
  - `agritrace.admin` / `agritrace123`
  - `admin.agritrace` / `admin2025`
  - `lacra.admin` / `lacra2025`

### **Login Process:**
1. **Access Code:** Enter `AGRITRACE2025`
2. **Username:** Choose one of the admin usernames above
3. **Password:** Use corresponding password
4. **Scope:** Limited to AgriTrace360™ module only

## Administrative Capabilities

### **✅ AgriTrace-Specific Functions:**
- **Configuration Management** - AgriTrace module settings only
- **Feature Flag Control** - Enable/disable AgriTrace features
- **System Health Monitoring** - AgriTrace module performance
- **Real-time Controls** - AgriTrace-specific system controls
- **Performance Metrics** - AgriTrace module analytics
- **Access Control** - AgriTrace user permissions
- **Emergency Controls** - AgriTrace emergency procedures
- **Activity Logging** - AgriTrace administrative actions

### **❌ Restricted Functions:**
- **No Polipus Platform Access** - Cannot control other modules
- **No Cross-Module Administration** - Limited to AgriTrace only
- **No Global System Changes** - Cannot affect platform-wide settings
- **No Other Module Data** - Cannot access Live Trace, Land Map360, etc.

## API Endpoints

### **Authentication:**
- `POST /api/agritrace-admin/login` - Admin login with access code

### **Dashboard & Monitoring:**
- `GET /api/agritrace-admin/dashboard` - AgriTrace admin dashboard
- `GET /api/agritrace-admin/health` - System health status
- `GET /api/agritrace-admin/metrics` - Performance metrics

### **Configuration Management:**
- `GET /api/agritrace-admin/configurations` - View configurations
- `POST /api/agritrace-admin/configurations` - Update configurations

### **Feature Control:**
- `GET /api/agritrace-admin/features` - View feature flags
- `POST /api/agritrace-admin/features/toggle` - Toggle features

### **System Controls:**
- `GET /api/agritrace-admin/controls` - View active controls
- `POST /api/agritrace-admin/controls` - Apply new controls

## Technical Implementation

### **Backend Components:**
- **AgriTraceAdminController** - `server/agritrace-admin-backend.ts`
- **Authentication Middleware** - JWT-based with scope validation
- **API Routes** - Dedicated `/api/agritrace-admin/*` endpoints
- **Database Integration** - AgriTrace-specific database operations

### **Security Features:**
- **Access Code Verification** - Requires `AGRITRACE2025`
- **Scope Limitation** - Enforced AgriTrace-only access
- **Token Validation** - JWT with `agritrace_admin` user type
- **Activity Logging** - All administrative actions logged
- **Time-limited Sessions** - 8-hour token expiration

## Usage Instructions

1. **Navigate to AgriTrace Admin Portal**
2. **Enter Access Code:** `AGRITRACE2025`
3. **Login with Admin Credentials:**
   - Username: `agritrace.admin`
   - Password: `agritrace123`
4. **Access Limited Admin Dashboard**
5. **Manage AgriTrace-Specific Settings Only**

## Platform Architecture

### **Modular Administration:**
- Each Polipus module will have its own limited admin activity
- AgriTrace360™ is the first module with dedicated admin system
- Future modules (Live Trace, Land Map360, etc.) will follow same pattern
- No single administrator controls entire Polipus platform

### **Separation of Concerns:**
- **AgriTrace Admin** - Agricultural traceability management
- **Polipus Super Backend** - Legacy platform-wide controls (limited use)
- **Module-Specific Admins** - Each module maintains its own controls

## Notes
- This implementation ensures proper modular control
- Administrative activity is limited to AgriTrace module only
- Users can now provide new instructions for portal completion
- System follows user preference for modular administrative structure
- All administrative actions are logged and auditable