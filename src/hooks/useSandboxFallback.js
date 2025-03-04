import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COMMON_PATHS, DEFAULT_TIMEOUT_MS } from './sandbox-fallback/constants';
import { isInEditorUICooldown, broadcastEditorUIInteraction, broadcastManualReset } from './sandbox-fallback/editorInteraction';
import { createNavigationHandlers } from './sandbox-fallback/navigation';
import { createSandboxMessageHandler } from './sandbox-fallback/sandboxMessageHandler';

const useSandboxFallback = (timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [availablePaths, setAvailablePaths] = useState(COMMON_PATHS);
  const loadingTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const lastSandboxResetTime = useRef(Date.now());
  const mousePositionsRef = useRef([]);

  // Enhanced editor interaction detection
  const checkEditorUICooldown = useCallback(() => {
    return isInEditorUICooldown(lastSandboxResetTime.current);
  }, []);

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

  // Improved editor UI detection using mouse pattern recognition
  useEffect(() => {
    // Function to detect if mouse movements follow editor UI patterns
    const detectEditorPattern = (positions) => {
      if (positions.length < 5) return false;
      
      // Check if mouse is mostly on the left side (editor area)
      const leftSideCount = positions.filter(pos => pos.x < window.innerWidth * 0.35).length;
      const probability = leftSideCount / positions.length;
      
      return probability > 0.7; // If more than 70% of positions are in editor UI area
    };
    
    const detectEditorInteraction = (event) => {
      // Add current position to history
      mousePositionsRef.current.push({ x: event.clientX, y: event.clientY, time: Date.now() });
      
      // Keep only the last 20 positions
      if (mousePositionsRef.current.length > 20) {
        mousePositionsRef.current.shift();
      }
      
      // Only detect once we have enough data points
      if (mousePositionsRef.current.length >= 5) {
        // If pattern detected, mark as editor UI interaction
        if (detectEditorPattern(mousePositionsRef.current)) {
          console.log('Editor UI interaction pattern detected');
          lastSandboxResetTime.current = Date.now();
          broadcastEditorUIInteraction();
          
          // Clear positions to avoid repeated detections
          mousePositionsRef.current = [];
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
  
  // Additional prevention for rapid sandbox toggles
  useEffect(() => {
    const preventRapidToggles = (event) => {
      if (event.data && event.data.type === 'sandbox-status' && event.data.status === 'loading') {
        // Check if we're already loading
        if (isLoading) {
          console.log('Preventing duplicate loading state');
          event.stopPropagation();
          return false;
        }
      }
    };
    
    // This uses capture phase to intercept events before normal handlers
    window.addEventListener('message', preventRapidToggles, { capture: true });
    
    return () => {
      window.removeEventListener('message', preventRapidToggles, { capture: true });
    };
  }, [isLoading]);

  // Monitor sandbox state changes from window messages
  useEffect(() => {
    const handleSandboxMessage = createSandboxMessageHandler({
      isInEditorUICooldown: checkEditorUICooldown,
      setIsLoading,
      setLoadingStartTime,
      setShowFallback,
      timeoutMs,
      loadingTimeoutRef,
      lastSandboxResetTime
    });

    // Add event listener for sandbox messages
    window.addEventListener('message', handleSandboxMessage);
    
    return () => {
      window.removeEventListener('message', handleSandboxMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, checkEditorUICooldown, timeoutMs]);

  // Setup navigation handlers
  const { handleReturnToPreviousScreen, handleNavigateToPath } = createNavigationHandlers(
    navigate, 
    setShowFallback
  );

  // Reset sandbox state - also marks that we've manually interacted with editor
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
    broadcastManualReset();
  }, []);

  return {
    isLoading,
    loadingStartTime,
    showFallback,
    availablePaths,
    handleReturnToPreviousScreen: () => handleReturnToPreviousScreen(previousPathRef, location),
    handleNavigateToPath,
    resetSandboxState,
    currentPath: location.pathname,
    isInEditorUICooldown: checkEditorUICooldown,
  };
};

export default useSandboxFallback;
