import React, { createContext, useEffect, useReducer, useState } from 'react';
import { Socket } from 'phoenix';

const PhoenixSocketContext = createContext({ socket: null });

const tableColumns = [
  {
    name: 'ID',
    selector: 'id',
  },
  {
    name: 'Floor',
    selector: 'floor',
    sortable: true,
  },
  {
    name: 'Install date',
    selector: 'install_date',
    sortable: true,
  },
  {
    name: 'Last maintenance',
    selector: 'last_maintenance',
    sortable: true,
  },
  {
    name: 'Latitude',
    selector: 'latitude',
    sortable: true,
  },
  {
    name: 'Longitude',
    selector: 'longitude',
    sortable: true,
  },
  {
    name: 'Machine type',
    selector: 'machine_type',
    sortable: true,
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
  },
];

const initialState = {
  tableColumns: tableColumns,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setData':
      return {
        ...state,
        data: action.payload.data,
      };
    default:
      return state;
  }
}

const PhoenixSocketProvider = ({ wsUrl, options, children }) => {
  const [socket, setSocket] = useState();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const socket = new Socket(wsUrl, { params: options });
    socket.connect();
    setSocket(socket);
  }, [options, wsUrl]);

  if (!socket) return null;

  return (
    <PhoenixSocketContext.Provider value={{ socket, state, dispatch }}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export { PhoenixSocketContext, PhoenixSocketProvider };
