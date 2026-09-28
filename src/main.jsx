import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Safely remove any externally injected Netlify badge widget
if (typeof window !== 'undefined') {
  const removeNetlifyBadge = () => {
    const badges = document.querySelectorAll('[data-netlify-badge], .netlify-badge, #netlify-badge, a[href*="netlify.com"]');
    badges.forEach((el) => {
      // Don't remove our own internal links if any, only floating badges
      if (el.tagName === 'A' && (el.innerText.includes('Powered by Netlify') || el.closest('[style*="fixed"], [style*="absolute"]'))) {
        const parent = el.closest('[style*="fixed"]') || el;
        parent.remove();
      } else if (el.id === 'netlify-badge' || el.classList.contains('netlify-badge') || el.hasAttribute('data-netlify-badge')) {
        el.remove();
      }
    });
  };

  window.addEventListener('DOMContentLoaded', removeNetlifyBadge);
  const observer = new MutationObserver(() => removeNetlifyBadge());
  observer.observe(document.body, { childList: true, subtree: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

