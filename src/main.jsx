import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WeddingInvitation from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WeddingInvitation />
  </React.StrictMode>,
)
