import React, { useState, useEffect, useContext } from 'react';

import { PhoenixSocketContext } from '../contexts/Context.js';
import { baseUrl, machinesUrl } from '../utils/constans.js';
import { localeDate } from '../utils/utils.js';
import useChannel from '../hooks/useChannel.js';

// components
const DataTableApp = () => {
  const value = useContext(PhoenixSocketContext);
  const { state, dispatch } = value;

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const LOAD_MESSAGE = 'new';
  const [eventsResponse, setEventsResponse] = useState(null);
  const [eventsChannel] = useChannel('events');

  const [dataLine, setDataLine] = useState(null);
  const [rowLine, setRowLine] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [sortedBy, setSortedBy] = useState('last_maintenance');
  const [orderBy, setOrderBy] = useState(true);
  const [liveOn, setLiveOn] = useState(false);

  const machines = state.data;
  const tableColumns = state.tableColumns;

  const DataTableContainer = () => {
    const responseData = Array.isArray(machines) ? machines : machines.data;
    const tableTitles = Object.keys(responseData[0]);
    return (
      <div className='data-table'>
        <DataTableTitle {...tableTitles} />
        <DataTableRows />
      </div>
    );
  };

  const DataTableEventsRow = ({ ...dataLine }) => {
    const maxEvents = 10;
    const responseData = dataLine?.id ? dataLine : dataLine?.data;
    responseData.events.length = maxEvents;
    return (
      <div className='data-row events-rows'>
        <p>
          Last {maxEvents} events results on {responseData.id}
        </p>
        {responseData.events.map((item) => {
          return (
            <div className={`events-row cell ${item.status}`}>
              <div className='events-item'>{item.status}: </div>
              <div className='events-item'>{localeDate(item.timestamp)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const DataTableRow = ({ ...restProps }) => {
    const rowClassName =
      rowLine === restProps.id ? 'active data-row' : 'data-row';
    const keyRowId = `data_row_${restProps.id}`;
    const keyCellIdPart = `data_cell_${restProps.id}`;
    return (
      <>
        <div className={rowClassName} key={keyRowId} data-row-id={keyRowId}>
          {Object.entries(restProps).map((cell) => {
            const param = { keyCellIdPart, cell };
            return <DataTableCell {...param} />;
          })}
        </div>
      </>
    );
  };

  const DataTableCell = ({ ...restProps }) => {
    const { cell, keyCellIdPart } = restProps;
    const key = cell[0];
    const value = cell[1];
    const keyCellId = `${keyCellIdPart}_${key}`;

    let cellEntry = '';
    let cellClassName = 'cell';

    switch (key) {
      case 'id':
        cellEntry = FetchLink(value);
        break;
      case 'install_date':
        cellEntry = localeDate(value);
        break;
      case 'last_maintenance':
        cellEntry = localeDate(value);
        break;
      case 'status':
        cellClassName = `cell ${value}`;
        cellEntry = value;
        break;
      default:
        cellEntry = value;
        break;
    }
    return (
      <div key={keyCellId} className={cellClassName}>
        {cellEntry}
      </div>
    );
  };

  const DataTableTitle = ({ ...tableTitles }) => {
    const cells = Object.values(tableTitles);
    const sortedColumns = sortedBy;
    const orderColumn = orderBy ? 'cell title desc' : 'cell title asc';
    return (
      <div key='title_row' className='data-row title' {...cells}>
        {cells.map((item) => {
          const actTitle = tableColumns.find((elem) => elem.selector === item);
          const activeColClassName =
            sortedColumns === item ? orderColumn : 'cell title';
          return (
            <div
              className={activeColClassName}
              onClick={(ev) => {
                HandleTitle(ev, actTitle?.sortable);
              }}
              data-title={item}
              key={`title_${item}`}
            >
              {actTitle?.name}
            </div>
          );
        })}
      </div>
    );
  };

  const DataTableRows = () => {
    return Object.values(machines).map((line) => {
      if (dataLine && line?.id === dataLine?.id) {
        return (
          <>
            <DataTableRow {...line} />
            <DataTableEventsRow {...dataLine} />
          </>
        );
      } else return <DataTableRow {...line} />;
    });
  };

  //functions
  const HandleTitle = (ev, sortable) => {
    ev.preventDefault();
    if (sortable) {
      const title = ev.target.getAttribute('data-title');
      setOrderBy(!orderBy);
      setSortedBy(title);
    }
  };

  const machineLineFetch = async ({ url }) => {
    try {
      const response = await fetch(url);
      const result = await response.json();

      setDataLine(result.data);
    } catch (error) {
      //TODO setErrorLine(error);
    }
  };

  const FetchLink = (entry) => {
    const HandleFetchMachine = (ev) => {
      ev.preventDefault();
      const link = ev.target;
      const entry = link.textContent;

      setRowLine(entry);
      setLinkUrl(`${baseUrl}${machinesUrl}/${entry}`);
    };

    return (
      <span className='fetch-link' data={entry} onClick={HandleFetchMachine}>
        {entry}
      </span>
    );
  };

  // set context
  const setData = (fetchData) => {
    dispatch({
      type: 'setData',
      payload: { data: fetchData },
    });
  };

  const allMachinesFetch = async ({ url }) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data);
      setLoaded(true);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const DataSorting = () => {
    switch (sortedBy) {
      case 'floor':
      case 'latitude':
      case 'longitude':
        if (orderBy) {
          machines.sort((a, b) => {
            return a[sortedBy] - b[sortedBy];
          });
        } else {
          machines.sort((a, b) => {
            return b[sortedBy] - a[sortedBy];
          });
        }
        break;
      default:
        if (machines) {
          if (orderBy) {
            machines.sort((a, b) => {
              return a[sortedBy].localeCompare(b[sortedBy]);
            });
          } else {
            machines.sort((a, b) => {
              return b[sortedBy].localeCompare(a[sortedBy]);
            });
          }
        }
        break;
    }
    setData(machines);
  };

  const EffectedLine = (lineId) => {
    if (lineId) {
      const dataRowId = `data_row_${lineId}`;
      document
        .querySelector(`[data-row-id=${dataRowId}]`)
        .classList.add('updated');
    }
  };

  const LiveDataUpdate = (updateData) => {
    const currentLine = machines?.find(
      (item) => item.id === updateData.machine_id
    );
    if (currentLine) {
      currentLine.status = updateData.status;
      currentLine.last_maintenance = updateData.timestamp;
    }
    DataSorting(machines);
  };

  const handleReload = () => {
    const allMachinesUrl = baseUrl + machinesUrl;
    allMachinesFetch({ url: allMachinesUrl });
  };

  const handleLiveData = () => {
    setLiveOn(!liveOn);
  };

  // useEffects
  useEffect(() => {
    const allMachineUrl = `${baseUrl}${machinesUrl}`;
    allMachinesFetch({ url: allMachineUrl });
  }, []);

  useEffect(() => {
    machineLineFetch({ url: linkUrl });
  }, [linkUrl]);

  useEffect(() => {
    DataSorting(machines);
  }, [orderBy, sortedBy]);

  /**
   * // Join correct channel and log events
    const channel = socket.channel("events", {});
    channel.join();
    channel.on("new", (event) => console.log(event));
   */

  useEffect(() => {
    if (!eventsChannel && !liveOn) return;
    if (eventsChannel && liveOn) {
      eventsChannel.on(LOAD_MESSAGE, (channelResponse) => {
        setEventsResponse(channelResponse);
      });
    }
    if (eventsChannel && !liveOn) {
    }
  }, [eventsChannel, liveOn]);

  useEffect(() => {
    if (eventsResponse?.machine_id) {
      const machineId = eventsResponse.machine_id;
      LiveDataUpdate(eventsResponse);
      EffectedLine(machineId);
      console.log('socket:', eventsResponse);
    }
  }, [eventsResponse]);

  if (loading) return <div className='loading'>Data fetch in progress...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <button onClick={handleReload}>Reload</button>
      <button onClick={handleLiveData} disabled={liveOn}>
        {liveOn ? 'Living process' : 'Start Live Data fetch'}
      </button>

      <div className='table-content'>{loaded && <DataTableContainer />}</div>
    </>
  );
};

export default DataTableApp;
