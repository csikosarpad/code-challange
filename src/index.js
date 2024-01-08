import React from 'react';
import ReactDOM from 'react-dom/client';

import { PhoenixSocketProvider } from './contexts/Context';
import { socketUrl } from './utils/constans.js';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PhoenixSocketProvider wsUrl={socketUrl}>
      <App />
    </PhoenixSocketProvider>
  </React.StrictMode>
);
