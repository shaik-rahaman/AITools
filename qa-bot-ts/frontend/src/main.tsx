import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './index.css'

// Lightweight DOM debug banner to verify JS execution even if React fails
try {
  const dbg = document.createElement('div')
  dbg.id = 'debug-js-banner'
  dbg.style.position = 'fixed'
  dbg.style.top = '8px'
  dbg.style.right = '8px'
  dbg.style.zIndex = '99999'
  dbg.style.background = '#ef4444'
  dbg.style.color = 'white'
  dbg.style.padding = '6px 10px'
  dbg.style.borderRadius = '6px'
  dbg.style.fontSize = '12px'
  dbg.textContent = 'JS: main.tsx executed'
  document.body.appendChild(dbg)
} catch (e) {
  console.warn('Could not append debug banner', e)
}

console.log('main.tsx loading...')
console.log('root element:', document.getElementById('root'))

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('App render scheduled')
} catch (err) {
  console.error('React mount error:', err)
  try {
    const errEl = document.createElement('pre')
    errEl.style.position = 'fixed'
    errEl.style.top = '40px'
    errEl.style.left = '8px'
    errEl.style.right = '8px'
    errEl.style.zIndex = '99999'
    errEl.style.background = '#111827'
    errEl.style.color = '#fca5a5'
    errEl.style.padding = '12px'
    errEl.style.borderRadius = '6px'
    errEl.style.maxHeight = '60vh'
    errEl.style.overflow = 'auto'
    errEl.textContent = String(err)
    document.body.appendChild(errEl)
  } catch (e) {
    console.warn('Could not show mount error element', e)
  }
}

console.log('main.tsx finished')
