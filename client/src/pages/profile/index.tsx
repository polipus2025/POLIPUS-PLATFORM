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
    // Parse query parameters from URL
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const type = urlParams.get('type') || '';
    const id = urlParams.get('id') || '';
    
    setUserType(type);
    setUserId(id);

    // If no parameters, try to get from session/auth
    if (!type || !id) {
      // In a real application, you would get these from your auth context
      // For now, redirect to login or dashboard
      navigate('/');
    }
  }, [location, navigate]);

  if (!userType || !userId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
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