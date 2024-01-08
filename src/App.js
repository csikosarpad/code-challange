import React from 'react';

import AppHeader from './components/AppHeader.js';
import DataTableApp from './components/DataTableApp.js';

import './assets/application.scss';

const App = () => {
  return (
    <div className='App'>
      <AppHeader />
      <DataTableApp />
    </div>
  );
};

export default App;
