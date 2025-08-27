import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import ProfileView from './profile-view';
import ProfileEdit from './profile-edit';
import ProfileSettings from './profile-settings';

export default function ProfileRouter() {
  const [location, navigate] = useLocation();
  const [userType, setUserType] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Parse query parameters from URL - handle both full URL and query string
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type') || '';
    const id = url.searchParams.get('id') || '';
    
    console.log('Profile Router - Parsed params:', { type, id, location });
    
    setUserType(type);
    setUserId(id);

    // Don't redirect immediately - wait for parameters to be available
    // Only redirect if we're absolutely sure there are no valid parameters
  }, [location, navigate]);

  // Show loading while parsing parameters
  if (!userType || !userId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <div>
            <p className="text-gray-600">Loading profile...</p>
            <p className="text-xs text-gray-400">Type: {userType || 'missing'} | ID: {userId || 'missing'}</p>
            {(!userType || !userId) && (
              <p className="text-red-500 text-sm mt-2">
                Missing profile parameters. Please access profile through your dashboard.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Switch>
        <Route path="/profile/edit">
          <ProfileEdit 
            userType={userType as 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory'} 
            userId={userId} 
          />
        </Route>
        
        <Route path="/profile/settings">
          <ProfileSettings 
            userType={userType as 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory'} 
            userId={userId} 
          />
        </Route>
        
        <Route path="/profile">
          <ProfileView 
            userType={userType as 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory'} 
            userId={userId} 
          />
        </Route>
      </Switch>
    </div>
  );
}