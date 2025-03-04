
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global persistent root
let root = null;

// Track if we've already rendered the app
let hasRendered = false;

// Track sandbox state
let sandboxState = 'unknown';

// Prevent multiple rapid render attempts
let preventRapidRerendersTimeout = null;

// Constants for throttling and debouncing
const MOUSE_INTERACTION_COOLDOWN = 5000; // 5 seconds cooldown (increased)
const LOADING_STATE_DISPLAY_DELAY = 500; // 500ms delay before showing loading (increased)
const RENDER_DEBOUNCE_TIMEOUT = 1000; // 1000ms debounce for render (increased)
const LOADING_THROTTLE = 10000; // 10 seconds between loading screens (increased)
const EDITOR_UI_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown for editor UI interactions

// Track timing data
let lastMouseInteractionTime = 0;
let lastLoadingStateTime = 0;
let lastEditorUIInteractionTime = 0;
let consecutiveLoadingEvents = 0;

// Function to hide loading fallback
const hideLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'none';
    
    // Also inform the app state that loading has stopped
    if (window.__MUHEESI_APP_STATE) {
      window.__MUHEESI_APP_STATE.stopLoadingTimer();
    }
  }
};

// Function to show loading fallback with delay to prevent flashes
const showLoadingFallback = () => {
  // Check if we're in editor UI cooldown period
  const now = Date.now();
  if (now - lastEditorUIInteractionTime < EDITOR_UI_COOLDOWN) {
    console.log("Ignoring loading state due to recent editor UI interaction");
    return;
  }
  
  // Don't show if we've shown recently
  if (now - lastLoadingStateTime < LOADING_THROTTLE) {
    console.log("Throttling loading screen - shown too recently");
    return;
  }
  
  // Add a small delay to prevent flashing during quick interactions
  clearTimeout(window.loadingDisplayTimeout);
  window.loadingDisplayTimeout = setTimeout(() => {
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
      lastLoadingStateTime = now;
      
      // Also inform the app state that loading has started
      if (window.__MUHEESI_APP_STATE) {
        window.__MUHEESI_APP_STATE.startLoadingTimer();
      }
    }
  }, LOADING_STATE_DISPLAY_DELAY);
};

// Function to detect editor UI interactions based on mouse position and patterns
const detectEditorUIInteraction = (event) => {
  // Check if mouse is in editor UI area (usually left side)
  if (event.clientX < window.innerWidth * 0.3) { // Assuming editor is on the left ~30% of screen
    const now = Date.now();
    // Only register if not in cooldown period already
    if (now - lastEditorUIInteractionTime > EDITOR_UI_COOLDOWN) {
      console.log("Editor UI interaction detected, applying 1 hour cooldown");
      lastEditorUIInteractionTime = now;
      
      // Also update the global app state
      if (window.__MUHEESI_APP_STATE) {
        window.__MUHEESI_APP_STATE.markEditorUIInteraction();
      }
    }
  }
};

// Enhanced render function with sandbox state preservation
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.warn("Root element not found");
      return;
    }

    // Only create root if it doesn't exist
    if (!root) {
      console.log("Creating new React root");
      root = ReactDOM.createRoot(rootElement);
    }
    
    // Don't re-render if app is already rendered and in a good state
    if (hasRendered && sandboxState === 'ready') {
      console.log("App already rendered and sandbox is ready, skipping render");
      hideLoadingFallback();
      return;
    }
    
    // Hide loading indicator after 300ms delay to ensure it's not flashing
    setTimeout(() => {
      hideLoadingFallback();
    }, 300);

    console.log("Rendering App component");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Mark as rendered
    hasRendered = true;
    
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering app:", error);
    // Show error in UI
    showLoadingFallback();
    const fallbackContent = document.querySelector('#loading-fallback .content');
    if (fallbackContent) {
      fallbackContent.innerHTML = `
        <h2>Application Error</h2>
        <p>There was a problem loading the application.</p>
        <p style="color: #ef4444;">Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="background-color: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-top: 1rem; border: none; cursor: pointer;">
          Reload Page
        </button>
      `;
    }
  }
};

// Enhanced debounce function with cooldown check
const debouncedRender = () => {
  // Skip rendering if it's due to rapid hover/mouse interaction
  const now = Date.now();
  
  // Skip if in editor UI cooldown
  if (now - lastEditorUIInteractionTime < EDITOR_UI_COOLDOWN) {
    console.log("Skipping render due to editor UI interaction cooldown");
    return;
  }
  
  // Skip if due to recent mouse interaction
  if (now - lastMouseInteractionTime < MOUSE_INTERACTION_COOLDOWN) {
    console.log("Skipping render due to recent mouse interaction");
    return;
  }
  
  if (preventRapidRerendersTimeout) {
    clearTimeout(preventRapidRerendersTimeout);
  }
  
  preventRapidRerendersTimeout = setTimeout(() => {
    // Only render if the app hasn't rendered yet or if sandbox state changed to ready
    if (!hasRendered || sandboxState === 'ready') {
      renderApp();
    }
  }, RENDER_DEBOUNCE_TIMEOUT);
};

// Track mouse events to prevent unnecessary renders with debounce
document.addEventListener('mousemove', (event) => {
  lastMouseInteractionTime = Date.now();
  
  // Check for editor UI interactions
  detectEditorUIInteraction(event);
  
  // If we have window.__MUHEESI_APP_STATE from index.html, update it too
  if (window.__MUHEESI_APP_STATE) {
    window.__MUHEESI_APP_STATE.updateHoverTime();
  }
});

// Enhanced sandbox message handling
window.addEventListener('message', (event) => {
  // Check if the message is from the Lovable editor about sandbox state
  if (event.data && event.data.type === 'sandbox-status') {
    const previousState = sandboxState;
    sandboxState = event.data.status;
    
    console.log(`Sandbox status changed: ${event.data.status} (previous: ${previousState})`);
    
    // Check for editor UI interaction cooldown
    const now = Date.now();
    const isInEditorUICooldown = now - lastEditorUIInteractionTime < EDITOR_UI_COOLDOWN;
    
    // Check for rapid loading state changes which indicate hover issues
    if (previousState === 'ready' && event.data.status === 'loading') {
      consecutiveLoadingEvents++;
      
      // If we're seeing too many loading events in succession, it's likely a hover issue
      if (consecutiveLoadingEvents > 2 && Date.now() - lastMouseInteractionTime < MOUSE_INTERACTION_COOLDOWN) {
        console.log("Ignoring loading state due to detected hover interaction pattern");
        return;
      }
      
      // Also ignore if we're in editor UI cooldown
      if (isInEditorUICooldown) {
        console.log("Ignoring loading state due to editor UI interaction cooldown");
        return;
      }
    } else if (event.data.status === 'ready') {
      consecutiveLoadingEvents = 0;
    }
    
    // Only react to significant state transitions with throttling
    if (previousState !== sandboxState) {
      if (sandboxState === 'ready') {
        // For 'ready' state, render if not already rendered
        if (!hasRendered) {
          console.log("Sandbox ready, rendering app");
          renderApp();
        } else {
          console.log("Sandbox ready, app already rendered");
          hideLoadingFallback();
        }
      } else if (sandboxState === 'loading') {
        // Only show loading if we're coming from a non-loading state
        // and not during recent mouse interaction
        // and not during editor UI cooldown
        if (previousState !== 'loading' && 
            now - lastMouseInteractionTime > MOUSE_INTERACTION_COOLDOWN &&
            now - lastLoadingStateTime > LOADING_THROTTLE &&
            !isInEditorUICooldown) {
          console.log("Sandbox loading, showing fallback");
          showLoadingFallback();
        } else {
          console.log("Ignoring loading state due to recent interaction, throttle, or editor UI cooldown");
        }
      }
    } else {
      console.log("Ignoring duplicate sandbox status");
    }
  }
});

// Initial render attempt with debounce
console.log("Script loaded, attempting initial render");
debouncedRender();

// Ensure we render when the DOM is ready
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', debouncedRender);
} else {
  console.log("Document already loaded");
}

// Handle window load event as final fallback
window.addEventListener('load', () => {
  console.log("Window fully loaded");
  if (!hasRendered) {
    console.log("App not rendered yet, attempting render on window load");
    debouncedRender();
  } else {
    hideLoadingFallback();
  }
});

// Add error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
});
