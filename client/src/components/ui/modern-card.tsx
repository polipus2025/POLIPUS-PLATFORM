import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  status?: {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: React.ReactNode;
  className?: string;
  animated?: boolean;
  style?: 'glass' | 'modern' | 'cyberpunk' | 'gradient';
}

export default function ModernCard({
  title,
  subtitle,
  value,
  icon: Icon,
  iconColor = 'text-blue-500',
  gradient = 'gradient-primary',
  trend,
  status,
  children,
  className = '',
  animated = true,
  style = 'modern'
}: ModernCardProps) {
  const getCardStyle = () => {
    switch (style) {
      case 'glass':
        return 'glass-card';
      case 'cyberpunk':
        return 'cyberpunk-card';
      case 'gradient':
        return `${gradient} text-white`;
      default:
        return 'modern-card';
    }
  };

  const baseClasses = `${getCardStyle()} ${animated ? 'floating' : ''} ${className}`;

  return (
    <Card className={baseClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${style === 'gradient' ? 'bg-white/20' : 'bg-gray-100'}`}>
              <Icon className={`h-5 w-5 ${style === 'gradient' ? 'text-white' : iconColor}`} />
            </div>
          )}
          <div>
            <CardTitle className={`text-sm font-medium ${style === 'gradient' ? 'text-white/90' : 'text-gray-600'}`}>
              {title}
            </CardTitle>
            {subtitle && (
              <p className={`text-xs ${style === 'gradient' ? 'text-white/70' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {status && (
          <Badge variant={status.variant} className="text-xs">
            {status.label}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="flex items-baseline space-x-2">
            <div className={`text-2xl font-bold ${style === 'gradient' ? 'text-white' : 'text-gray-900'}`}>
              {value}
            </div>
            {trend && (
              <div className={`flex items-center text-xs ${
                trend.isPositive 
                  ? style === 'gradient' ? 'text-green-200' : 'text-green-600'
                  : style === 'gradient' ? 'text-red-200' : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {trend.value}% {trend.label}
              </div>
            )}
          </div>
        )}
        {children && (
          <div className={`mt-4 ${style === 'gradient' ? 'text-white/90' : ''}`}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}