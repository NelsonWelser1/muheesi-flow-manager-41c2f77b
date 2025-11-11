import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export const ErrorState = ({ 
  title = "Something went wrong",
  message = "An error occurred while loading this content.",
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = false
}) => {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        <div className="flex gap-2">
          {showGoBack && onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
          {showRetry && onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const EmptyState = ({ 
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {Icon && (
          <div className="rounded-full bg-muted p-3 mb-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const PermissionDenied = ({ 
  message = "You don't have permission to access this feature.",
  requiredRole
}) => {
  return (
    <Card className="border-yellow-500/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-yellow-500/10 p-3 mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground mb-2 max-w-md">{message}</p>
        {requiredRole && (
          <p className="text-sm text-muted-foreground">
            Required role: <strong>{requiredRole}</strong>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
