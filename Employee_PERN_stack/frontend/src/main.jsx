//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/queryClients.js'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <QueryClientProvider client={queryClient}>
    <Toaster position='top-center'/>
    <App />
  </QueryClientProvider>

  //</StrictMode>,
)
