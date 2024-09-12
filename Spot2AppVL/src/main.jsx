import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <StrictMode>
      <App />
      <App />
    </StrictMode>,
  </div>
)
