import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n/config'
import './index.css'
import { initializeMockData } from './utils/storage'
import * as mockData from './data/mockData'

// Initialize mock data in localStorage
initializeMockData(mockData);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

