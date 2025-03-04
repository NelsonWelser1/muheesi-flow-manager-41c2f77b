
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, ArrowLeft, HomeIcon } from "lucide-react";
import useSandboxFallback from '@/hooks/useSandboxFallback';
import CooldownTimer from './sandbox-fallback/CooldownTimer';
import AvailablePathsList from './sandbox-fallback/AvailablePathsList';
import DebugActions from './sandbox-fallback/DebugActions';

const SandboxFallback = () => {
  const {
    isLoading,
    loadingStartTime,
    showFallback,
    availablePaths,
    handleReturnToPreviousScreen,
    handleNavigateToPath,
    resetSandboxState,
    currentPath,
    isInEditorUICooldown
  } = useSandboxFallback();

  const [expandedPaths, setExpandedPaths] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Don't show fallback on initial load for a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 5000); // 5 second grace period for initial load
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render anything if fallback shouldn't be shown
  if (!showFallback || (isInitialLoad && !loadingStartTime)) return null;

  // Calculate elapsed loading time
  const elapsedSeconds = loadingStartTime 
    ? Math.floor((Date.now() - loadingStartTime) / 1000) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <Card className="max-w-md w-full bg-white p-6 shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Preview Taking Too Long</h2>
          <p className="text-gray-600 mb-4">
            The sandbox has been loading for {elapsedSeconds} seconds. 
            {!isInEditorUICooldown() && " This might be caused by network issues."}
          </p>
          
          {isInEditorUICooldown() ? (
            <CooldownTimer isInEditorUICooldown={isInEditorUICooldown} />
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-amber-600 animate-spin" />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleReturnToPreviousScreen} 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Previous Screen
          </Button>
          
          <Button 
            onClick={() => handleNavigateToPath('/')} 
            className="w-full bg-gray-700 hover:bg-gray-800" 
            size="lg"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          
          <Button 
            onClick={() => setExpandedPaths(!expandedPaths)} 
            variant="outline" 
            className="w-full"
          >
            {expandedPaths ? "Hide" : "Show"} Available Paths
          </Button>
          
          {expandedPaths && (
            <AvailablePathsList 
              paths={availablePaths} 
              currentPath={currentPath} 
              onNavigate={handleNavigateToPath} 
            />
          )}
          
          <DebugActions 
            onReset={resetSandboxState} 
            isInEditorUICooldown={isInEditorUICooldown}
          />
        </div>
      </Card>
    </div>
  );
};

export default SandboxFallback;
