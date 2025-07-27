import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Settings, LogOut, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  userRole?: string;
  userName?: string;
  notifications?: number;
  onLogout?: () => void;
  onMessages?: () => void;
  onSettings?: () => void;
}

export default function ModernHeader({
  title,
  subtitle,
  userRole = "User",
  userName = "Admin",
  notifications = 0,
  onLogout,
  onMessages,
  onSettings
}: ModernHeaderProps) {
  return (
    <header className="modern-card sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title & Branding */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Center - Navigation Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="glass-button text-gray-700 hover:text-blue-600"
              onClick={onMessages}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
              {notifications > 0 && (
                <div className="ml-2 flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full blink-red"></div>
                  <Badge className="bg-red-500 text-white animate-pulse">
                    {notifications}
                  </Badge>
                </div>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="glass-button text-gray-700 hover:text-blue-600"
              onClick={onSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="glass-button w-10 h-10 p-0 rounded-full"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 glass-card px-4 py-2">
              <Avatar className="w-8 h-8 ring-2 ring-blue-500/20">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="gradient-primary text-white text-sm">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              className="glass-button text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:ml-2 md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}