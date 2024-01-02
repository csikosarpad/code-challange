import React from 'react';
import { Socket } from 'phoenix';
import { socketUrl } from '../utils/constans.js';

const SocketMessageBox = () => {
  let socketLine = '';

  const SocketMessageBoxLine = ({ ...socketMessage }) => {
    const { id } = socketMessage;
    if (id) {
      socketLine = JSON.stringify(socketMessage) + '\n\t';
      document.getElementById('socket-message-box').value += socketLine;
    }
  };

  const socket = new Socket(socketUrl);
  socket.connect();
  const channel = socket.channel('events', {});
  channel.join();
  channel.on('new', (eventList) => {
    SocketMessageBoxLine({ ...eventList });
  });

  return (
    <div>
      <textarea rows='10' readonly id='socket-message-box'></textarea>
    </div>
  );
};

export default SocketMessageBox;
