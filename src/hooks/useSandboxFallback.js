
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
  const preventFallbackOnPaths = ['/manage-inventory']; // Paths where we want to prevent fallback

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

  // Enhanced editor UI detection using mouse position
  useEffect(() => {
    const detectEditorInteraction = (event) => {
      // Check if mouse is in editor UI area (usually left side)
      const editorWidth = window.innerWidth * 0.35; // Consider the left 35% to be editor area
      if (event.clientX < editorWidth) {
        console.log('Editor UI interaction detected via mouse position');
        lastSandboxResetTime.current = Date.now();
        broadcastEditorUIInteraction();
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

  // Monitor sandbox state changes from window messages
  useEffect(() => {
    const handleSandboxMessage = createSandboxMessageHandler({
      isInEditorUICooldown: checkEditorUICooldown,
      setIsLoading,
      setLoadingStartTime,
      setShowFallback,
      timeoutMs,
      loadingTimeoutRef,
      lastSandboxResetTime,
      currentPath: location.pathname,
      preventFallbackOnPaths // Pass the paths to prevent fallback
    });

    // Add event listener for sandbox messages
    window.addEventListener('message', handleSandboxMessage);
    
    return () => {
      window.removeEventListener('message', handleSandboxMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, checkEditorUICooldown, timeoutMs, location.pathname]);

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

  // Determine if fallback should be shown based on current path
  const shouldShowFallback = useCallback(() => {
    // Don't show fallback on certain paths regardless of state
    if (preventFallbackOnPaths.includes(location.pathname)) {
      return false;
    }
    return showFallback;
  }, [showFallback, location.pathname]);

  return {
    isLoading,
    loadingStartTime,
    showFallback: shouldShowFallback(),
    availablePaths,
    handleReturnToPreviousScreen: () => handleReturnToPreviousScreen(previousPathRef, location),
    handleNavigateToPath,
    resetSandboxState,
    currentPath: location.pathname,
    isInEditorUICooldown: checkEditorUICooldown,
  };
};

export default useSandboxFallback;
