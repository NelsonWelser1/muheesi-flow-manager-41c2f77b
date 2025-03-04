
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global variables
let root = null;
let retryCount = 0;
const MAX_RETRIES = 5;

// Function to safely render the app
const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  // Only create root if the element exists and root hasn't been created yet
  if (rootElement && !root) {
    try {
      console.log("Initializing React root element");
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
  }
};

// Function to retry rendering with exponential backoff
const retryRender = () => {
  retryCount++;
  const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
  console.log(`Retrying render (${retryCount}/${MAX_RETRIES}) after ${delay}ms`);
  setTimeout(renderApp, delay);
};

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
