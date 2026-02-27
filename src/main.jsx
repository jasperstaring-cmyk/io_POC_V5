import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './LanguageContext.jsx'
import DemoBanner from './components/DemoBanner.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <DemoBanner />
      <App />
    </LanguageProvider>
  </React.StrictMode>
)
