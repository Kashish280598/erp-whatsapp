import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import metabaseService from '@/lib/services/metabaseService';

interface MetabaseDashboardProps {
  title?: string;
  showControls?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  dashboardId?: number;
  debug?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MetabaseDashboard: React.FC<MetabaseDashboardProps> = ({
  title = 'Metabase Dashboard',
  showControls = true,
  theme = 'auto',
  dashboardId,
  debug = false,
  onLoad,
  onError,
  className
}) => {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine actual theme based on prop and system preference
  const actualTheme = theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setIsEmpty(false);

    try {
      const url = await metabaseService.createEmbedUrl();
      setIframeUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    loadDashboard();
  };

  const handleOpenInNewTab = () => {
    if (iframeUrl) {
      window.open(iframeUrl, '_blank');
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load dashboard content');
    onError?.('Failed to load dashboard content');
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
            <p><strong>Dashboard ID:</strong> {dashboardId || metabaseService.getConfig().dashboardId}</p>
            <p><strong>Site URL:</strong> {metabaseService.getConfig().siteUrl}</p>
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
                    <li>• Wrong dashboard ID (currently using ID: {metabaseService.getConfig().dashboardId})</li>
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