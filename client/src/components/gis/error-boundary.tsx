import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export class GISErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GIS Mapping Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {this.props.fallbackTitle || 'GIS System Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {this.props.fallbackMessage || 'There was an error loading the GIS mapping system. Please try refreshing the page.'}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
              <Button 
                onClick={() => this.setState({ hasError: false })}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
            {this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="text-xs text-gray-400 mt-2 bg-gray-50 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default GISErrorBoundary;