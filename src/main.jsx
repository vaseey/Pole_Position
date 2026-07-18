import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './PolePosition_Preview.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Remove the static loading shell once React has taken over.
const boot = document.getElementById('pp-boot')
if (boot) {
  boot.style.opacity = '0'
  boot.style.transition = 'opacity .25s ease'
  setTimeout(() => boot.remove(), 300)
}
