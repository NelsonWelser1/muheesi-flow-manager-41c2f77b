
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Create root only once
let root = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root')
  
  // Only create root if it doesn't already exist
  if (rootElement && !root) {
    root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
})
