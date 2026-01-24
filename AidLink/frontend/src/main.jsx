import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n/config'
import './index.css'
import { initializeMockData } from './utils/storage'
import * as mockData from './data/mockData'
import './utils/devUtils' // Makes clearSEDSData() available in console

// Initialize mock data in localStorage
try {
  initializeMockData(mockData);
} catch (error) {
  console.error('Error initializing mock data:', error);
}

// Render app
console.log('Starting app render...');
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found, rendering app...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; text-align: center;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please refresh the page.</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 20px;">${error.message}</pre>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 12px;">${error.stack}</pre>
    </div>
  `;
}

