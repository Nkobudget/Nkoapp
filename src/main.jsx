import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import CustomScrollbar from './components/CustomScrollbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* reducedMotion="user" drops transform-based animation for anyone who
        prefers reduced motion, while keeping gentle opacity fades. */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
        <CustomScrollbar />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
