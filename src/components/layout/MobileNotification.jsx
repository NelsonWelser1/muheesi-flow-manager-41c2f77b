
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen width is less than 768px
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Only show the notification on mobile if it hasn't been dismissed
      const isDismissed = localStorage.getItem('mobileNotificationDismissed');
      setIsVisible(isMobileView && !isDismissed);
    };

    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember that the user has dismissed the notification
    localStorage.setItem('mobileNotificationDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 bg-background/80 backdrop-blur-sm">
      <Alert className="bg-amber-50 border-amber-200">
        <div className="flex items-center justify-between">
          <AlertDescription className="text-amber-800">
            For full features, we recommend using desktop mode or a larger screen.
          </AlertDescription>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default MobileNotification;
