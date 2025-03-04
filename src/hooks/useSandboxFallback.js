
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
  const SANDBOX_RESET_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

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

  // Monitor sandbox state changes from window messages with improved detection
  useEffect(() => {
    const handleSandboxMessage = (event) => {
      if (event.data && event.data.type === 'sandbox-status') {
        const status = event.data.status;
        const now = Date.now();
        
        // Check if we're in the editor UI cooldown period - prevent sandboxing after editor UI interactions
        const isInEditorUICooldown = 
          now - lastSandboxResetTime.current < SANDBOX_RESET_COOLDOWN;
        
        // Check if the event is from a mouse/hover interaction
        const isMouseEvent = window.__MUHEESI_APP_STATE && 
          window.__MUHEESI_APP_STATE.isInHoverCooldown();

        // Handle app state messages based on sandbox status and conditions
        if (status === 'loading') {
          // Enhanced condition to prevent unnecessary loading states
          if (isInEditorUICooldown && isMouseEvent) {
            console.log('Ignoring sandbox loading state due to editor UI interaction cooldown');
            return;
          }

          // Only start the loading timer if not already loading
          if (!isLoading) {
            console.log('Sandbox loading state detected, starting fallback timer');
            setIsLoading(true);
            setLoadingStartTime(now);
            
            // Clear existing timeout if any
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }
            
            // Set timeout for fallback UI - show after timeoutMs
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

    // Add event listener for sandbox messages
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

  // Reset sandbox state detection
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
    
    // Also send a message to inform parent about state reset
    try {
      window.parent.postMessage({ type: 'sandbox-manual-reset' }, '*');
    } catch (e) {
      console.log('Could not send reset message to parent');
    }
  }, []);

  // Detect editor UI interaction directly through mousemove on document
  useEffect(() => {
    const detectEditorInteraction = (event) => {
      // Check if mouse is in editor UI area (usually left side)
      if (event.clientX < window.innerWidth * 0.3) {
        const now = Date.now();
        // Check if we're not already in cooldown
        if (now - lastSandboxResetTime.current > SANDBOX_RESET_COOLDOWN) {
          console.log('Editor UI interaction detected via mouse position, activating cooldown');
          lastSandboxResetTime.current = now;
          
          // Also update global state if available
          if (window.__MUHEESI_APP_STATE) {
            window.__MUHEESI_APP_STATE.markEditorUIInteraction();
          }
        }
      }
    };
    
    // Add throttled event listener to avoid performance issues
    let lastMove = 0;
    const throttledDetect = (event) => {
      const now = Date.now();
      if (now - lastMove > 100) { // Throttle to max 10 checks per second
        lastMove = now;
        detectEditorInteraction(event);
      }
    };
    
    document.addEventListener('mousemove', throttledDetect, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', throttledDetect);
    };
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
