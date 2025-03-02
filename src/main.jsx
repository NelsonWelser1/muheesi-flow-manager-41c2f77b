
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Check if root element already has a React instance to prevent re-rendering
const rootElement = document.getElementById('root');
if (!rootElement._reactRootContainer) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
