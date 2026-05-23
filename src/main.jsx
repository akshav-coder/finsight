import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
