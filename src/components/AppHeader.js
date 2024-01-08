import React, { useState } from 'react';

import { greetings } from '../utils/constans.js';

const AppHeader = () => {
  const [opened, setOpened] = useState(true);

  return (
    <header className='App-header'>
      <div onClick={() => setOpened(!opened)}>
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
  );
};

export default AppHeader;
