
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Create root only once and handle initialization properly
let root = null;

// Function to safely render the app
const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  // Only create root if the element exists and root hasn't been created yet
  if (rootElement && !root) {
    try {
      root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error("Error rendering app:", error);
    }
  }
};

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // If DOMContentLoaded has already fired, render immediately
  renderApp();
}
