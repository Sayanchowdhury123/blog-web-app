import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry } from './sentry'
import * as Sentry from "@sentry/react";

initSentry()


createRoot(document.getElementById('root')).render(
 

  <App />

   
    
  ,
)
