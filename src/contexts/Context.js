import { createContext, useEffect, useReducer } from 'react';
import { Socket } from 'phoenix';

export const Context = createContext();

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

const Provider = ({ wsUrl, options, children }) => {
  const socket = new Socket(wsUrl, { params: options });
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.connect();
  }, [options, wsUrl]);

  return (
    <Context.Provider value={{ socket, state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
