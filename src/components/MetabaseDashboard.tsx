import React, { useState, useEffect } from 'react';
import { metabaseService } from '@/lib/services/metabaseService';
import type { MetabaseEmbedOptions } from '@/lib/services/metabaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/theme-provider';

interface MetabaseDashboardProps {
  dashboardId?: number;
  height?: number | string;
  width?: number | string;
  bordered?: boolean;
  titled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  showControls?: boolean;
  title?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  debug?: boolean; // Add debug mode
}

export const MetabaseDashboard: React.FC<MetabaseDashboardProps> = ({
  dashboardId,
  bordered = true,
  titled = true,
  theme = 'auto',
  className,
  showControls = true,
  title = 'Analytics Dashboard',
  onLoad,
  onError,
  debug = false
}) => {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const { theme: currentTheme } = useTheme();

  // Determine the actual theme to use
  const getActualTheme = (): 'light' | 'dark' => {
    if (theme === 'auto') {
      if (currentTheme === 'system') {
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return currentTheme === 'dark' ? 'dark' : 'light';
    }
    return theme;
  };

  const actualTheme = getActualTheme();

  // Generate embed URL
  const generateEmbedUrl = async () => {
    try {
      const options: MetabaseEmbedOptions = {
        bordered,
        titled,
        theme: actualTheme
      };

      // If dashboardId is provided, create a new service instance
      if (dashboardId) {
        const customService = new (metabaseService.constructor as any)({
          ...metabaseService['config'],
          dashboardId
        });
        return await customService.createEmbedUrl(options);
      }

      return await metabaseService.createEmbedUrl(options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate embed URL');
      setError(error.message);
      onError?.(error);
      return '';
    }
  };

  // Refresh the dashboard
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey(prev => prev + 1);
  };

  // Open dashboard in new tab
  const handleOpenInNewTab = async () => {
    const url = await generateEmbedUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const url = await generateEmbedUrl();
        if (url) {
          setIframeUrl(url);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load dashboard');
        setError(error.message);
        onError?.(error);
      }
    };

    loadDashboard();
  }, [dashboardId, bordered, titled, actualTheme, refreshKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
    
    // Check if dashboard appears empty after a delay
    setTimeout(() => {
      const iframe = document.querySelector('iframe[src*="metabase"]');
      if (iframe) {
        try {
          // Try to detect if the dashboard is empty
          const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
          if (iframeDoc) {
            const hasContent = iframeDoc.body && iframeDoc.body.children.length > 0;
            setIsEmpty(!hasContent);
          }
        } catch {
          // Cross-origin restrictions, can't access iframe content
          console.log('Cannot access iframe content due to CORS restrictions');
        }
      }
    }, 3000); // Wait 3 seconds for dashboard to load
  };

  const handleIframeError = () => {
    setIsLoading(false);
    const error = new Error('Failed to load Metabase dashboard. This may be due to authentication issues or the dashboard not being configured for embedding.');
    setError(error.message);
    onError?.(error);
  };

  return (
    <Card className={cn("w-full h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6">
        <CardTitle className="text-sm md:text-base font-medium text-neutral-800 dark:text-primary-400">{title}</CardTitle>
        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0 md:h-9 md:w-9"
            >
              <RefreshCw className={cn("h-4 w-4 md:h-5 md:w-5", isLoading && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="h-8 px-2 md:h-9 md:px-3"
            >
              <ExternalLink className="h-4 w-4 mr-1 md:h-5 md:w-5" />
              <span className="hidden md:inline">Open</span>
            </Button>
          </div>
        )}
      </CardHeader>
      
      {/* Debug Information */}
      {debug && (
        <div className="p-4 md:p-6 bg-muted/50 border-b">
          <h4 className="text-sm font-semibold mb-2">Debug Information</h4>
          <div className="text-xs space-y-1">
            <p><strong>Dashboard ID:</strong> {dashboardId || metabaseService['config'].dashboardId}</p>
            <p><strong>Site URL:</strong> {metabaseService['config'].siteUrl}</p>
            <p><strong>Theme:</strong> {actualTheme}</p>
            <p><strong>Embed URL:</strong> {iframeUrl}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Empty:</strong> {isEmpty ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 flex-1 flex flex-col w-full">
        <div className="relative w-full h-full flex-1 min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 md:h-6 md:w-6 animate-spin" />
                <span className="text-sm md:text-base text-muted-foreground">Loading dashboard...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center max-w-md mx-4">
                <div className="text-sm md:text-base text-destructive mb-2">{error}</div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {isEmpty && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center max-w-md mx-4">
                <div className="text-sm md:text-base text-muted-foreground mb-4">
                  <p className="mb-2">Dashboard appears to be empty.</p>
                  <p className="text-xs md:text-sm">This could be because:</p>
                  <ul className="text-xs md:text-sm text-left mt-2 space-y-1">
                    <li>• No data has been added to the database</li>
                    <li>• The dashboard queries are not returning results</li>
                    <li>• Database connection issues</li>
                    <li>• Wrong dashboard ID (currently using ID: {metabaseService['config'].dashboardId})</li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {iframeUrl && (
            <iframe
              key={refreshKey}
              src={iframeUrl}
              frameBorder={0}
              width="100%"
              height="100%"
              allowTransparency
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="w-full h-full"
              title={title}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 