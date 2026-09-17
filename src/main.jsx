import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  }).catch(() => {});
}
if (window.caches) {
  caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
  }).catch(() => {});
}
