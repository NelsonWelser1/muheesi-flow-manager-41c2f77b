
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

// Track mouse interaction with the sandbox
let lastMouseInteractionTime = 0;
const MOUSE_INTERACTION_COOLDOWN = 1000; // 1 second cooldown

// Function to hide loading fallback
const hideLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
};

// Function to show loading fallback
const showLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'flex';
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
    
    // If we've already rendered and the sandbox is still ready, don't re-render
    if (hasRendered && sandboxState === 'ready') {
      console.log("App already rendered and sandbox is ready, skipping render");
      hideLoadingFallback();
      return;
    }
    
    // Remove loading indicator
    hideLoadingFallback();

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
  }, 500); // 500ms debounce
};

// Track mouse events to prevent unnecessary renders
document.addEventListener('mousemove', () => {
  lastMouseInteractionTime = Date.now();
});

// Enhanced sandbox message handling
window.addEventListener('message', (event) => {
  // Check if the message is from the Lovable editor about sandbox state
  if (event.data && event.data.type === 'sandbox-status') {
    const previousState = sandboxState;
    sandboxState = event.data.status;
    
    console.log(`Sandbox status changed: ${event.data.status} (previous: ${previousState})`);
    
    // Only react to significant state transitions
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
        // This prevents flickering during hover events
        if (previousState !== 'loading') {
          console.log("Sandbox loading, showing fallback");
          showLoadingFallback();
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
