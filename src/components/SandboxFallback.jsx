
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader, RefreshCw, ArrowLeft, HomeIcon, Clock } from "lucide-react";
import useSandboxFallback from '@/hooks/useSandboxFallback';

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
  const [cooldownRemaining, setCooldownRemaining] = useState(null);
  
  // Calculate and update cooldown remaining time
  useEffect(() => {
    if (!isInEditorUICooldown()) {
      setCooldownRemaining(null);
      return;
    }
    
    const updateCooldownTimer = () => {
      // One hour in milliseconds
      const HOUR_MS = 60 * 60 * 1000;
      const lastReset = window.__MUHEESI_APP_STATE?.lastEditorUIInteractionTime || 
                         Date.now() - HOUR_MS;
      const elapsed = Date.now() - lastReset;
      const remaining = Math.max(0, HOUR_MS - elapsed);
      
      // Convert to minutes and seconds
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      
      setCooldownRemaining(`${minutes}m ${seconds}s`);
    };
    
    // Update immediately
    updateCooldownTimer();
    
    // Then update every second
    const timer = setInterval(updateCooldownTimer, 1000);
    return () => clearInterval(timer);
  }, [isInEditorUICooldown]);

  // Don't render anything if fallback shouldn't be shown
  if (!showFallback) return null;

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
            {isInEditorUICooldown() ? (
              <span className="block text-amber-600 mt-2">
                Editor UI interaction detected. Sandbox refresh blocked for: 
                <span className="font-bold ml-1">{cooldownRemaining}</span>
              </span>
            ) : (
              " This might be caused by network issues."
            )}
          </p>
          
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              {isInEditorUICooldown() ? (
                <Clock className="h-6 w-6 text-amber-600" />
              ) : (
                <RefreshCw className="h-6 w-6 text-amber-600 animate-spin" />
              )}
            </div>
          </div>
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
            <div className="mt-4 border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <p className="text-sm text-gray-500 mb-2">Select a page to navigate to:</p>
              <ul className="space-y-2">
                {availablePaths.map((path) => (
                  <li key={path}>
                    <Button
                      variant={currentPath === path ? "default" : "ghost"}
                      className={`w-full justify-start text-left ${currentPath === path ? 'bg-blue-100 text-blue-800' : ''}`}
                      onClick={() => handleNavigateToPath(path)}
                    >
                      {path === '/' ? 'Home Page' : path.split('/').pop().replace(/-/g, ' ')}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Debug actions:</p>
            <div className="flex space-x-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={isInEditorUICooldown()}
              >
                Hard Refresh
                {isInEditorUICooldown() && (
                  <span className="ml-1 text-xs text-amber-600">(Locked)</span>
                )}
              </Button>
              <Button 
                onClick={resetSandboxState} 
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Reset Sandbox State
              </Button>
            </div>
            
            {isInEditorUICooldown() && (
              <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-800">
                Automatic refresh is blocked for {cooldownRemaining} to prevent infinite loading loops when interacting with the editor UI.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SandboxFallback;
