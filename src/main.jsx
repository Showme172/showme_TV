import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from './context/ConfigContext'
import { ContactProvider } from './context/ContactContext'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ConfigProvider>
          <ContactProvider>
            <App />
          </ContactProvider>
        </ConfigProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
