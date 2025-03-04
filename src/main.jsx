
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global variables
let root = null;
let retryCount = 0;
const MAX_RETRIES = 5;

// Function to hide loading fallback when app is rendered
const hideLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
};

// Function to safely render the app
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    // Only create root if the element exists and root hasn't been created yet
    if (rootElement && !root) {
      try {
        console.log("Initializing React root element");
        // Remove any loading indicator that might be inside the root
        if (document.getElementById('loading-fallback')) {
          hideLoadingFallback();
        }
        
        root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("App rendered successfully");
      } catch (error) {
        console.error("Error rendering app:", error);
        retryRender();
      }
    } else if (!rootElement && retryCount < MAX_RETRIES) {
      console.warn("Root element not found, will retry");
      retryRender();
    } else if (!root && retryCount < MAX_RETRIES) {
      console.warn("Root not created yet, will retry");
      retryRender();
    }
  } catch (error) {
    console.error("Fatal rendering error:", error);
    // Show error in UI if available
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>There was a problem loading the application. Please try refreshing the page.</p>
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  }
};

// Function to retry rendering with exponential backoff
const retryRender = () => {
  retryCount++;
  const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
  console.log(`Retrying render (${retryCount}/${MAX_RETRIES}) after ${delay}ms`);
  setTimeout(renderApp, delay);
};

// Immediately try to render when this script loads
console.log("Script loaded, attempting immediate render");
renderApp();

// Handle different document ready states
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  console.log("Document already loaded, rendering immediately");
  renderApp();
}

// Add a failsafe for very slow loading environments
window.addEventListener('load', () => {
  console.log("Window load event triggered");
  if (!root) {
    console.log("Root not created during normal flow, attempting final render");
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
