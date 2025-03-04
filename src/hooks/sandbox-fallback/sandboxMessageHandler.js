import { overrideSandboxLoadingState } from './editorInteraction';

/**
 * Create a handler for sandbox status messages
 * @param {Object} params - Parameters for the handler
 * @returns {Function} The message handler function
 */
export const createSandboxMessageHandler = ({
  isInEditorUICooldown,
  setIsLoading,
  setLoadingStartTime,
  setShowFallback,
  timeoutMs,
  loadingTimeoutRef,
  lastSandboxResetTime
}) => {
  // Keep track of rapid loading events to detect hover issues
  let loadingEventsCount = 0;
  let lastLoadingTime = 0;
  
  return (event) => {
    if (event.data && event.data.type === 'sandbox-status') {
      const status = event.data.status;
      const now = Date.now();
      
      // Strong cooldown enforcement - ignore sandbox loading events completely during cooldown
      if (isInEditorUICooldown(lastSandboxResetTime.current) && status === 'loading') {
        console.log('BLOCKED: Ignoring sandbox loading state due to active editor UI cooldown');
        
        // Immediately send a "ready" message to override the loading state
        overrideSandboxLoadingState();
        return;
      }
      
      // Detect potential hover-related rapid loading events
      if (status === 'loading') {
        // Check if this is a rapid loading event (within 2 seconds of the last one)
        if (now - lastLoadingTime < 2000) {
          loadingEventsCount++;
          
          // If we've seen multiple loading events in rapid succession, it's likely due to hover
          if (loadingEventsCount > 2) {
            console.log('BLOCKED: Ignoring sandbox loading state due to detected hover pattern');
            overrideSandboxLoadingState();
            return;
          }
        } else {
          // Reset counter if it's been more than 2 seconds
          loadingEventsCount = 1;
        }
        
        lastLoadingTime = now;
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
        loadingEventsCount = 0;
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        setIsLoading(false);
        setLoadingStartTime(null);
        setShowFallback(false);
      }
    }
  };
};
