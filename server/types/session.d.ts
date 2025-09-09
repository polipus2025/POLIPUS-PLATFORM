import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string | number;
    username?: string;
    userType?: string;
    role?: string;
    isAuthenticated?: boolean;
    inspectorId?: string;
    farmerId?: string;
    buyerId?: string;
    exporterId?: string;
  }
}