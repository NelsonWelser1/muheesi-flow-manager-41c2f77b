
import { isInEditorUICooldown, overrideSandboxLoadingState } from './editorInteraction';

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
  return (event) => {
    if (event.data && event.data.type === 'sandbox-status') {
      const status = event.data.status;
      
      // Strong cooldown enforcement - ignore sandbox loading events completely during cooldown
      if (isInEditorUICooldown(lastSandboxResetTime.current) && status === 'loading') {
        console.log('BLOCKED: Ignoring sandbox loading state due to active 1-hour editor UI cooldown');
        
        // Immediately send a "ready" message to override the loading state
        overrideSandboxLoadingState();
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
};
