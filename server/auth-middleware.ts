import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Secure JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = '2h'; // Short expiry for security
const REFRESH_TOKEN_EXPIRES = '7d'; // Longer expiry for refresh tokens

export interface AuthRequest extends Request {
  user?: {
    id: number;
    farmerId?: string;
    role: string;
    username: string;
  };
}

// Generate secure access token
export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'polipus-platform',
    audience: 'polipus-users',
    algorithm: 'HS256'
  });
}

// Generate secure refresh token
export function generateRefreshToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    issuer: 'polipus-platform',
    audience: 'polipus-users',
    algorithm: 'HS256'
  });
}

// Verify token middleware
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  // Check for token in httpOnly cookie (secure) or Authorization header (fallback)
  const token = req.cookies.accessToken || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    return res.status(500).json({ error: 'Token verification failed' });
  }
}

// Set secure cookie options
export function setSecureTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set access token cookie (httpOnly, secure, sameSite)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    path: '/'
  });
  
  // Set refresh token cookie (httpOnly, secure, sameSite)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/'
  });
}

// Clear authentication cookies
export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

// Token refresh endpoint
export function refreshTokens(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    
    // Generate new tokens
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      farmerId: decoded.farmerId,
      role: decoded.role,
      username: decoded.username
    });
    
    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
      farmerId: decoded.farmerId,
      role: decoded.role,
      username: decoded.username
    });
    
    // Set new secure cookies
    setSecureTokenCookies(res, newAccessToken, newRefreshToken);
    
    res.json({ success: true, message: 'Tokens refreshed successfully' });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}