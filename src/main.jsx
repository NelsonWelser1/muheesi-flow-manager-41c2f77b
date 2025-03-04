
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global persistent root
let root = null;

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

    // Check if we already have a root
    if (!root) {
      console.log("Creating new React root");
      root = ReactDOM.createRoot(rootElement);
    }
    
    // Remove loading indicator
    hideLoadingFallback();

    console.log("Rendering App component");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
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

// Handle Lovable sandbox environment
window.addEventListener('message', (event) => {
  // Check if the message is from the Lovable editor about sandbox state
  if (event.data && event.data.type === 'sandbox-status') {
    if (event.data.status === 'ready') {
      console.log("Sandbox ready, rendering app");
      renderApp();
    } else if (event.data.status === 'loading') {
      console.log("Sandbox loading, showing fallback");
      showLoadingFallback();
    }
  }
});

// Attempt immediate render when script loads
console.log("Script loaded, attempting initial render");
renderApp();

// Ensure we render when the DOM is ready
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  console.log("Document already loaded");
}

// Handle window load event as final fallback
window.addEventListener('load', () => {
  console.log("Window fully loaded");
  hideLoadingFallback();
});

// Add error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
});
