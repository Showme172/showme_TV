import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from './context/ConfigContext'
import { ContactProvider } from './context/ContactContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <ContactProvider>
          <App />
        </ContactProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
