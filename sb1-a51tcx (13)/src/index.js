import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CarDataProvider } from './context/CarDataContext'
import './utils/suppressWarnings'
import { app, setCars } from './server.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CarDataProvider>
      <App setCars={setCars} />
    </CarDataProvider>
  </React.StrictMode>,
)