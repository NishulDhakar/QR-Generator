import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Get dark mode preference for the error boundary
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedDarkMode = localStorage.getItem('darkMode');
const darkMode = savedDarkMode ? JSON.parse(savedDarkMode) : prefersDarkMode;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary darkMode={darkMode}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)