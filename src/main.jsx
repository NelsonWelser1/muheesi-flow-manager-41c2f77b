
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global persistent root
let root = null;

// Track if we've already rendered the app
let hasRendered = false;

// Create and configure the React root
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }

    // Only create root if it doesn't exist
    if (!root) {
      console.log("Creating new React root");
      root = ReactDOM.createRoot(rootElement);
    }
    
    // Hide loading indicator
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
      fallback.style.display = 'none';
    }

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
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
      const content = fallback.querySelector('.content');
      if (content) {
        content.innerHTML = `
          <h2>Application Error</h2>
          <p>There was a problem loading the application.</p>
          <p style="color: red;">Error: ${error.message || 'Unknown error'}</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
            Reload Page
          </button>
        `;
      }
    }
  }
};

// Handle sandbox messages more reliably
window.addEventListener('message', (event) => {
  // Check if the message is from the Lovable editor about sandbox state
  if (event.data && event.data.type === 'sandbox-status') {
    console.log(`Sandbox status: ${event.data.status}`);
    
    if (event.data.status === 'ready') {
      // For 'ready' state, render if not already rendered
      if (!hasRendered) {
        console.log("Sandbox ready, rendering app");
        renderApp();
      } else {
        console.log("Sandbox ready, app already rendered");
        // Hide loading fallback
        const fallback = document.getElementById('loading-fallback');
        if (fallback) {
          fallback.style.display = 'none';
        }
      }
    }
  }
});

// Initial render attempt
console.log("Script loaded, attempting initial render");
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Ensure we render when window loads as a fallback
window.addEventListener('load', () => {
  console.log("Window fully loaded");
  if (!hasRendered) {
    console.log("App not rendered yet, attempting render on window load");
    renderApp();
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
