import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';

interface ProfileDropdownProps {
  userName: string;
  userEmail?: string;
  userType: 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory' | 'warehouse-inspector' | 'port-inspector' | 'land-inspector';
  userId: string;
  profileImageUrl?: string;
  onLogout: () => void;
}

export default function ProfileDropdown({ 
  userName, 
  userEmail, 
  userType, 
  userId, 
  profileImageUrl, 
  onLogout 
}: ProfileDropdownProps) {
  const [, navigate] = useLocation();

  // Get user initials for avatar fallback
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Normalize user type for profile routes
  const normalizeUserType = (type: string): string => {
    switch (type) {
      case 'warehouse-inspector':
      case 'port-inspector': 
      case 'land-inspector':
        return 'inspector';
      default:
        return type;
    }
  };

  const normalizedUserType = normalizeUserType(userType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="profile-menu-trigger">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profileImageUrl} alt={userName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userName}</p>
            {userEmail && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {userEmail}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => navigate(`/profile?type=${normalizedUserType}&id=${userId}`)}
          data-testid="menu-view-profile"
        >
          <User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => navigate(`/profile/edit?type=${normalizedUserType}&id=${userId}`)}
          data-testid="menu-edit-profile"
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => navigate(`/profile/settings?type=${normalizedUserType}&id=${userId}`)}
          data-testid="menu-settings"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={onLogout}
          data-testid="menu-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}