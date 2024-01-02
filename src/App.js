import React, { useState } from 'react';

import DataTable from './components/DataTable.js';
import SocketMessageBox from './components/SocketMessageBox.js';
import { greetings } from './utils/constans.js';

import './assets/application.scss';

function App() {
  const [opened, setOpened] = useState(true);

  /*const SocketMessageBox = () => {
    const { id, machine_id, status, timestamp } = socketMessage;
    const socketLine = (
      <div className='socket-line'>
        <div>{id}</div>
        <div>{machine_id}</div>
        <div>{status}</div>
        <div>{localeDate(timestamp)}</div>
      </div>
    );
    return socketLine;
  };

  const socket = new Socket(socketUrl);
  socket.connect();
  const channel = socket.channel('events', {});
  channel.join();
  channel.on('new', (eventList) => {
    setSocketMessage(eventList);
  });*/

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
      <SocketMessageBox />
      <DataTable />
    </div>
  );
}

export default App;
