
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Directory paths for auto-navigation
const COMMON_PATHS = [
  '/',
  '/dashboard',
  '/manage-inventory',
  '/manage-companies',
  '/feedback',
  '/manage-inventory/kajon-export',
  '/manage-inventory/kajon-export/export-manager',
  '/manage-inventory/kashari-farm',
  '/manage-inventory/bukomero-dairy',
  '/manage-inventory/smart-production',
  '/manage-inventory/sales-marketing',
];

const useSandboxFallback = (timeoutMs = 30000) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [availablePaths, setAvailablePaths] = useState(COMMON_PATHS);
  const loadingTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const lastSandboxResetTime = useRef(Date.now());
  const SANDBOX_RESET_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

  // Store visit history for fallback navigation
  useEffect(() => {
    if (location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Monitor sandbox state changes from window messages
  useEffect(() => {
    const handleSandboxMessage = (event) => {
      if (event.data && event.data.type === 'sandbox-status') {
        const status = event.data.status;
        const now = Date.now();
        
        // Check if we're in the editor UI cooldown period
        const isInEditorUICooldown = 
          now - lastSandboxResetTime.current < SANDBOX_RESET_COOLDOWN;
          
        // Check if the event is from a mouse/hover interaction
        const isMouseEvent = window.__MUHEESI_APP_STATE && 
          window.__MUHEESI_APP_STATE.isInHoverCooldown();

        // Ignore sandbox resets within cooldown period or from editor UI
        if (isInEditorUICooldown && isMouseEvent && status === 'loading') {
          console.log('Ignoring sandbox loading state due to editor UI interaction cooldown');
          return;
        }

        if (status === 'loading') {
          // Only start the loading timer if not already loading
          if (!isLoading) {
            console.log('Sandbox loading state detected, starting fallback timer');
            setIsLoading(true);
            setLoadingStartTime(now);
            
            // Clear existing timeout if any
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }
            
            // Set timeout for fallback UI
            loadingTimeoutRef.current = setTimeout(() => {
              console.log('Loading timeout exceeded, showing fallback UI');
              setShowFallback(true);
            }, timeoutMs);
          }
        } else if (status === 'ready') {
          // Reset loading state
          console.log('Sandbox ready state detected, clearing fallback timer');
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          setIsLoading(false);
          setLoadingStartTime(null);
          setShowFallback(false);
          
          // Update last successful sandbox reset time
          lastSandboxResetTime.current = now;
        }
      }
    };

    window.addEventListener('message', handleSandboxMessage);
    return () => {
      window.removeEventListener('message', handleSandboxMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, timeoutMs]);

  // Handler for returning to previous screen
  const handleReturnToPreviousScreen = useCallback(() => {
    console.log('Attempting to return to previous screen:', previousPathRef.current);
    if (previousPathRef.current) {
      navigate(previousPathRef.current);
    } else {
      navigate('/');
    }
    setShowFallback(false);
  }, [navigate]);

  // Handler for navigating to a specific path
  const handleNavigateToPath = useCallback((path) => {
    console.log('Navigating to path:', path);
    navigate(path);
    setShowFallback(false);
  }, [navigate]);

  // Reset sandbox state detection
  const resetSandboxState = useCallback(() => {
    console.log('Manually resetting sandbox state');
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
    setLoadingStartTime(null);
    setShowFallback(false);
    lastSandboxResetTime.current = Date.now();
  }, []);

  return {
    isLoading,
    loadingStartTime,
    showFallback,
    availablePaths,
    handleReturnToPreviousScreen,
    handleNavigateToPath,
    resetSandboxState,
    currentPath: location.pathname,
  };
};

export default useSandboxFallback;
