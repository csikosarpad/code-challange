import React, { useState } from 'react';

import DataTable from './components/DataTable.js';
import { greetings } from './utils/constans.js';

import './assets/application.scss';

function App() {
  const [opened, setOpened] = useState(true);

  return (
    <div className='App'>
      <header className='App-header'>
        <div onClick={(ev) => setOpened(!opened)}>
          {opened && <h1>Code challange</h1>}
          <h3>Árpád Csikos' solution for Zeiss</h3>
          {opened && (
            <h3 className='greetings'>
              Greetings to the auditors:
              {greetings.map((item) => (
                <span>[{item}]</span>
              ))}
            </h3>
          )}
        </div>
      </header>
      <DataTable />
    </div>
  );
}

export default App;
