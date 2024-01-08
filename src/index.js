import React from 'react';
import ReactDOM from 'react-dom/client';

import Provider from './contexts/Context';
import { socketUrl } from './utils/constans.js';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider wsUrl={socketUrl}>
      <App />
    </Provider>
  </React.StrictMode>
);
