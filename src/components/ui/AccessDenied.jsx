import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * AccessDenied - Displays when user lacks permission to access a feature
 */
const AccessDenied = ({ 
  feature = 'this feature',
  message = null,
  showHomeButton = true,
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardDescription className="text-base">
            {message || `You don't have permission to access ${feature}. Please contact your administrator if you believe this is an error.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-2 justify-center">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
            {showHomeButton && (
              <Button 
                onClick={() => navigate('/manage-inventory')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
