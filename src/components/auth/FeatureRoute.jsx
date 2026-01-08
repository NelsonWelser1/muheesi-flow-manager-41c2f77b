import React from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Loader2 } from 'lucide-react';
import AccessDenied from '@/components/ui/AccessDenied';

/**
 * FeatureRoute - Protects routes based on feature access
 * 
 * @param {React.ReactNode} children - The content to render if access is granted
 * @param {string} featureKey - The feature key to check access for
 * @param {string} requiredAccessLevel - Minimum access level required ('view', 'edit', 'full')
 * @param {React.ReactNode} fallback - Custom fallback component (defaults to AccessDenied)
 * @param {React.ReactNode} loadingComponent - Custom loading component
 */
const FeatureRoute = ({ 
  children, 
  featureKey, 
  requiredAccessLevel = 'view',
  fallback = null,
  loadingComponent = null
}) => {
  const { data: access, isLoading, error } = useFeatureAccess(featureKey, requiredAccessLevel);

  // Show loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('FeatureRoute error:', error);
    return fallback || <AccessDenied feature={featureKey} />;
  }

  // Check if user has access
  if (!access?.canAccess) {
    return fallback || <AccessDenied feature={featureKey} />;
  }

  // Check access level hierarchy
  const accessLevelHierarchy = { view: 1, edit: 2, full: 3 };
  const userLevel = accessLevelHierarchy[access.accessLevel] || 0;
  const requiredLevel = accessLevelHierarchy[requiredAccessLevel] || 1;

  if (userLevel < requiredLevel) {
    return fallback || (
      <AccessDenied 
        feature={featureKey} 
        message={`You need "${requiredAccessLevel}" access to use this feature. You currently have "${access.accessLevel}" access.`}
      />
    );
  }

  // Access granted - render children
  return children;
};

export default FeatureRoute;
