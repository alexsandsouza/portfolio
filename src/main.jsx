import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { sitePath } from './utils/sitePath.js'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = event.target instanceof Element ? event.target.closest('a') : null
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href) return
  const next = sitePath(href)
  if (next === href) return
  event.preventDefault()
  if (anchor.target === '_blank') {
    window.open(next, '_blank', 'noopener')
    return
  }
  window.location.assign(next)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
