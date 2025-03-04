
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

const useSandboxFallback = (timeoutMs = 20000) => { // Reduced to 20 seconds for faster fallback
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [availablePaths, setAvailablePaths] = useState(COMMON_PATHS);
  const loadingTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const lastSandboxResetTime = useRef(Date.now());
  const SANDBOX_RESET_COOLDOWN = 60 * 60 * 1000; // Strict 1 hour cooldown in milliseconds

  // Enhanced editor interaction detection
  const isInEditorUICooldown = useCallback(() => {
    return Date.now() - lastSandboxResetTime.current < SANDBOX_RESET_COOLDOWN;
  }, [SANDBOX_RESET_COOLDOWN]);

  // Store visit history for fallback navigation
  useEffect(() => {
    if (location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Clear any existing timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Enhanced editor UI detection using mouse position
  useEffect(() => {
    const detectEditorInteraction = (event) => {
      // Check if mouse is in editor UI area (usually left side)
      const editorWidth = window.innerWidth * 0.35; // Consider the left 35% to be editor area
      if (event.clientX < editorWidth) {
        console.log('Editor UI interaction detected via mouse position');
        lastSandboxResetTime.current = Date.now();
        
        // Broadcast the interaction to ensure other components are aware
        try {
          window.parent.postMessage({ 
            type: 'editor-ui-interaction', 
            timestamp: Date.now() 
          }, '*');
        } catch (e) {
          console.log('Could not send editor interaction message to parent');
        }

        // Ensure cooldown is active in global app state
        if (window.__MUHEESI_APP_STATE) {
          window.__MUHEESI_APP_STATE.markEditorUIInteraction();
        }
      }
    };
    
    // Throttled event listener to reduce performance impact
    let lastMove = 0;
    const throttledDetect = (event) => {
      const now = Date.now();
      if (now - lastMove > 200) { // Throttle to 5 checks per second maximum
        lastMove = now;
        detectEditorInteraction(event);
      }
    };
    
    document.addEventListener('mousemove', throttledDetect, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', throttledDetect);
    };
  }, []);

  // Monitor sandbox state changes from window messages with improved detection
  useEffect(() => {
    const handleSandboxMessage = (event) => {
      if (event.data && event.data.type === 'sandbox-status') {
        const status = event.data.status;
        
        // Strong cooldown enforcement - ignore sandbox loading events completely during cooldown
        if (isInEditorUICooldown() && status === 'loading') {
          console.log('BLOCKED: Ignoring sandbox loading state due to active 1-hour editor UI cooldown');
          
          // Immediately send a "ready" message to override the loading state
          try {
            window.parent.postMessage({ 
              type: 'sandbox-override', 
              status: 'ready', 
              reason: 'editor-ui-cooldown-active' 
            }, '*');
          } catch (e) {
            console.log('Could not send override message to parent');
          }
          
          return;
        }
        
        // Handle app state messages based on sandbox status
        if (status === 'loading' && !isLoading) {
          console.log('Sandbox loading state detected, starting fallback timer');
          setIsLoading(true);
          setLoadingStartTime(Date.now());
          
          // Clear existing timeout if any
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          
          // Set timeout for fallback UI
          loadingTimeoutRef.current = setTimeout(() => {
            console.log('Loading timeout exceeded, showing fallback UI');
            setShowFallback(true);
          }, timeoutMs);
        } else if (status === 'ready') {
          // Reset loading state
          console.log('Sandbox ready state detected, clearing fallback timer');
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          setIsLoading(false);
          setLoadingStartTime(null);
          setShowFallback(false);
        }
      }
    };

    // Add event listener for sandbox messages
    window.addEventListener('message', handleSandboxMessage);
    
    return () => {
      window.removeEventListener('message', handleSandboxMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, isInEditorUICooldown, timeoutMs]);

  // Handler for returning to previous screen
  const handleReturnToPreviousScreen = useCallback(() => {
    console.log('Attempting to return to previous screen:', previousPathRef.current);
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      navigate(previousPathRef.current);
    } else {
      navigate('/');
    }
    setShowFallback(false);
  }, [navigate, location.pathname]);

  // Handler for navigating to a specific path
  const handleNavigateToPath = useCallback((path) => {
    console.log('Navigating to path:', path);
    navigate(path);
    setShowFallback(false);
  }, [navigate]);

  // Reset sandbox state detection - also marks that we've manually interacted with editor
  const resetSandboxState = useCallback(() => {
    console.log('Manually resetting sandbox state');
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
    setLoadingStartTime(null);
    setShowFallback(false);
    
    // Mark that we've manually reset - this will trigger the cooldown
    lastSandboxResetTime.current = Date.now();
    
    // Broadcast the manual reset to ensure other components are aware
    try {
      window.parent.postMessage({ 
        type: 'sandbox-manual-reset', 
        timestamp: Date.now(),
        source: 'user-action'
      }, '*');
    } catch (e) {
      console.log('Could not send reset message to parent');
    }
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
    isInEditorUICooldown,
  };
};

export default useSandboxFallback;
