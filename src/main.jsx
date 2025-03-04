
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Prevent duplicate renders by tracking if we've already rendered
let hasRendered = false;
let root = null;

// Function to hide loading fallback when app is rendered
const hideLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
};

// Function to safely render the app only once
const renderApp = () => {
  if (hasRendered) {
    console.log("App already rendered, skipping");
    return;
  }

  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.warn("Root element not found");
      return;
    }

    if (!root) {
      console.log("Initializing React root element");
      root = ReactDOM.createRoot(rootElement);
    }

    // Remove any loading indicator
    hideLoadingFallback();
    
    // Set render flag before actually rendering
    hasRendered = true;
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering app:", error);
    hasRendered = false; // Reset flag if render failed
  }
};

// Attempt immediate render when script loads
console.log("Script loaded, attempting immediate render");
renderApp();

// Fallback for when document is still loading
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  console.log("Document already loaded");
}

// Add error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
});

