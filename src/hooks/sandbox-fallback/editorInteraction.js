
import { SANDBOX_RESET_COOLDOWN } from './constants';

// Create or get the global app state
if (!window.__MUHEESI_APP_STATE) {
  window.__MUHEESI_APP_STATE = {
    lastEditorUIInteractionTime: 0,
    markEditorUIInteraction: function() {
      this.lastEditorUIInteractionTime = Date.now();
      console.log('Editor UI interaction marked at:', new Date(this.lastEditorUIInteractionTime).toTimeString());
    }
  };
}

/**
 * Check if the sandbox is currently in editor UI cooldown period
 * @param {number} lastResetTime - The timestamp of the last reset
 * @returns {boolean} - Whether cooldown is active
 */
export const isInEditorUICooldown = (lastResetTime) => {
  // Check both the reference time and the global app state
  const fromRef = Date.now() - lastResetTime < SANDBOX_RESET_COOLDOWN;
  const fromGlobal = window.__MUHEESI_APP_STATE && 
    (Date.now() - window.__MUHEESI_APP_STATE.lastEditorUIInteractionTime < SANDBOX_RESET_COOLDOWN);
  
  return fromRef || fromGlobal;
};

/**
 * Broadcast editor UI interaction to parent window
 */
export const broadcastEditorUIInteraction = () => {
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
};

/**
 * Broadcast manual sandbox reset event
 */
export const broadcastManualReset = () => {
  try {
    window.parent.postMessage({ 
      type: 'sandbox-manual-reset', 
      timestamp: Date.now(),
      source: 'user-action'
    }, '*');
  } catch (e) {
    console.log('Could not send reset message to parent');
  }
};

/**
 * Override sandbox loading state during cooldown
 */
export const overrideSandboxLoadingState = () => {
  try {
    window.parent.postMessage({ 
      type: 'sandbox-override', 
      status: 'ready', 
      reason: 'editor-ui-cooldown-active' 
    }, '*');
  } catch (e) {
    console.log('Could not send override message to parent');
  }
};
