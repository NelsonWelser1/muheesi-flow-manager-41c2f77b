import React from 'react';
import { AlertCircle, RefreshCw, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Minimal inline error display
export const InlineErrorFallback = ({ error, onReset, componentName }) => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error loading {componentName || 'component'}</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span className="text-sm">{error?.message || 'Something went wrong'}</span>
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

// Card-based error display for dashboard sections
export const CardErrorFallback = ({ error, onReset, componentName, description }) => (
  <Card className="border-destructive/50 bg-destructive/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        {componentName || 'Section'} Failed
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {error?.message || 'This section encountered an error and couldn\'t load.'}
      </p>
      {onReset && (
        <Button onClick={onReset} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </CardContent>
  </Card>
);

// Warning-style fallback for non-critical failures
export const WarningFallback = ({ error, onReset, componentName }) => (
  <Alert className="border-yellow-500/50 bg-yellow-500/10">
    <AlertTriangle className="h-4 w-4 text-yellow-600" />
    <AlertTitle className="text-yellow-900 dark:text-yellow-100">
      {componentName || 'Component'} Unavailable
    </AlertTitle>
    <AlertDescription className="space-y-2">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        {error?.message || 'This feature is temporarily unavailable.'}
      </p>
      {onReset && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="gap-2 border-yellow-500/50 hover:bg-yellow-500/20"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

// Minimal fallback for small components
export const MinimalErrorFallback = ({ error, onReset }) => (
  <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/5 rounded-md border border-destructive/20">
    <AlertCircle className="h-4 w-4 flex-shrink-0" />
    <span className="flex-1">{error?.message || 'Error loading'}</span>
    {onReset && (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onReset}
        className="h-6 w-6 p-0"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    )}
  </div>
);

// Full-section fallback with more details
export const SectionErrorFallback = ({ error, onReset, componentName, supportEmail }) => (
  <div className="flex items-center justify-center min-h-[400px] p-8">
    <Card className="max-w-md border-destructive/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-destructive">
          {componentName || 'Section'} Error
        </CardTitle>
        <CardDescription>
          This section couldn't load properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-mono text-muted-foreground">
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {onReset && (
            <Button onClick={onReset} className="flex-1 gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
        
        {supportEmail && (
          <p className="text-xs text-center text-muted-foreground">
            If this persists, contact{' '}
            <a href={`mailto:${supportEmail}`} className="underline">
              {supportEmail}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  </div>
);
