import { useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setBreadcrumbs, type BreadcrumbItem } from '@/lib/features/breadcrumb/breadcrumbSlice';
import { sidebarlinks, type SidebarLink } from '@/data/sidebar-links';

// Memoize the sidebar routes map for O(1) lookup
const sidebarRoutesMap = new Map<string, SidebarLink>();
const sidebarSubRoutesMap = new Map<string, { parent: string; route: SidebarLink }>();

// Initialize maps once
sidebarlinks.forEach(link => {
  sidebarRoutesMap.set(link.href, link);
  if (link.sub) {
    link.sub.forEach(subLink => {
      sidebarSubRoutesMap.set(subLink.href, {
        parent: link.href,
        route: { ...subLink, parent: link.href }
      });
    });
  }
});

// Function to find route in sidebar links - now O(1) lookup
const findRouteInSidebar = (path: string): SidebarLink | undefined => {
  // Remove trailing slash if exists
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  
  // Check main routes
  const mainRoute = sidebarRoutesMap.get(normalizedPath);
  if (mainRoute) return mainRoute;

  // Check sub-routes
  const subRoute = sidebarSubRoutesMap.get(normalizedPath);
  return subRoute?.route;
};

// Function to get dynamic path label
const getDynamicPathLabel = (path: string): string | null => {
  // Extract ID or slug from path
  const matches = path.match(/\/[^/]+\/([^/]+)$/);
  if (matches && matches[1]) {
    return matches[1].replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
  return null;
};

// Function to check if route is a main sidebar route - now O(1) lookup
const isMainSidebarRoute = (path: string): boolean => {
  return sidebarRoutesMap.has(path);
};

export const useBreadcrumbs = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const breadcrumbs = useAppSelector((state) => state.breadcrumb.items);

  // Memoize the dashboard route
  const dashboardRoute = useMemo(() => 
    sidebarlinks.find(link => link.href === '/dashboard'),
    []
  );

  // Memoize the breadcrumb generation function
  const generateBreadcrumbs = useCallback(() => {
    const breadcrumbItems: BreadcrumbItem[] = [];
    const paths = location.pathname.split('/').filter(Boolean);
    let currentPath = '';

    // If we're on a main sidebar route, don't add dashboard
    const isMainRoute = isMainSidebarRoute('/' + paths[0]);

    // Only add dashboard if we're not on a main route or if we're on dashboard itself
    if ((!isMainRoute && paths[0] !== 'dashboard' && dashboardRoute) || location.pathname === '/dashboard') {
      breadcrumbItems.push({
        label: dashboardRoute?.title || 'Dashboard',
        path: dashboardRoute?.href || '/dashboard',
      });
    }

    // Generate breadcrumb chain
    paths.forEach((part, index) => {
      currentPath += `/${part}`;
      
      // Skip if this is dashboard and we've already added it
      if (part === 'dashboard' && index === 0) {
        return;
      }

      const route = findRouteInSidebar(currentPath);
      const dynamicLabel = getDynamicPathLabel(currentPath);
      
      if (route) {
        breadcrumbItems.push({
          label: route.title,
          path: route.href,
        });
      } else if (dynamicLabel) {
        breadcrumbItems.push({
          label: dynamicLabel,
          path: currentPath,
        });
      }
    });

    return breadcrumbItems;
  }, [location.pathname, dashboardRoute]);

  useEffect(() => {
    const breadcrumbItems = generateBreadcrumbs();
    dispatch(setBreadcrumbs(breadcrumbItems));
  }, [generateBreadcrumbs, dispatch]);

  return breadcrumbs;
}; 