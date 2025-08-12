import { useState, useEffect } from 'react';
import { offlineAuth, type LoginCredentials, type LoginResult } from '@/services/offline-auth';

export function useOfflineAuth() {
  const [currentUser, setCurrentUser] = useState(offlineAuth.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for auth changes
    offlineAuth.onAuthChange((user) => {
      setCurrentUser(user);
    });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsLoading(true);
    
    try {
      const result = await offlineAuth.login(credentials);
      
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await offlineAuth.logout();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    return await offlineAuth.refreshToken();
  };

  const validateToken = async () => {
    return await offlineAuth.validateToken();
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: offlineAuth.isAuthenticated(),
    isOfflineUser: offlineAuth.isOfflineUser(),
    authToken: offlineAuth.getAuthToken(),
    login,
    logout,
    refreshToken,
    validateToken
  };
}