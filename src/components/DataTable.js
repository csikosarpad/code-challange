import React, { useState, useEffect } from 'react';
import { Socket } from 'phoenix';
import { localeDate } from '../utils/utils.js';
import {
  baseUrl,
  machinesUrl,
  tableColumns,
  socketUrl,
} from '../utils/constans.js';

const DataTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [dataLine, setDataLine] = useState(null);
  const [loadingLine, setLoadingLine] = useState(true);
  const [loadedLine, setLoadedLine] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [rowLine, setRowLine] = useState('');
  const [sortedBy, setSortedBy] = useState('last_maintenance');
  const [orderBy, setOrderBy] = useState(true);
  const [liveOn, setLiveOn] = useState(false);
  const [upDataEventList, setUpDataEventList] = useState({});

  const socket = new Socket(socketUrl);
  socket.connect();
  const channel = socket.channel('events', {});
  channel.join();

  const machinesFetch = async ({ url }) => {
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

  const machineLineFetch = async ({ url }) => {
    try {
      const response = await fetch(url);
      const result = await response.json();

      setDataLine(result.data);
      setLoadedLine(true);
      setLoadingLine(false);
    } catch (error) {
      setErrorLine(error);
      setLoadingLine(false);
    }
  };

  const FetchLink = (entry) => {
    const HandleFetchMachine = (ev) => {
      ev.preventDefault();
      const link = ev.target;
      const entry = link.textContent;

      setRowLine(entry);
      setLinkUrl(`${baseUrl}api/v1/machines/${entry}`);
    };

    return (
      <span className='fetch-link' data={entry} onClick={HandleFetchMachine}>
        {entry}
      </span>
    );
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
    const currentLine = data?.find((item) => item.id === updateData.machine_id);
    if (currentLine) {
      currentLine.status = updateData.status;
      currentLine.last_maintenance = updateData.timestamp;
    }
    //setData(data);
    DataSorting(data);
  };

  const LiveData = (onOff) => {
    switch (onOff) {
      case true:
        channel.on('new', (eventList) => {
          setUpDataEventList(eventList);
          console.log('socket:', eventList);
        });
        break;
      default:
        channel.off('new');
        break;
    }
  };

  const DataTableContainer = ({ ...restProps }) => {
    const { data } = restProps;
    const responseData = Array.isArray(data) ? data : data.data;
    const tableTitles = Object.keys(responseData[0]);
    return (
      <div className='data-table'>
        <DataTableTitle {...tableTitles} />
        <DataTableRows {...restProps} />
      </div>
    );
  };

  const HandleTitle = (ev, sortable) => {
    ev.preventDefault();
    if (sortable) {
      const title = ev.target.getAttribute('data-title');
      setOrderBy(!orderBy);
      setSortedBy(title);
    }
  };

  const DataTableTitle = ({ ...tableTitles }) => {
    const cells = Object.values(tableTitles);
    const sortedColumns = sortedBy;
    const orderColumn = orderBy ? 'cell title desc' : 'cell title asc';
    return (
      <div key='title_row' className='data-row title' {...cells}>
        {cells.map((item) => {
          const activeColClassName =
            sortedColumns === item ? orderColumn : 'cell title';
          const actTitle = tableColumns.find((elem) => elem.selector === item);
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

  const DataTableRows = ({ ...restProps }) => {
    const { data } = restProps;
    return Object.values(data).map((line) => {
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

  const handleReload = () => {
    const allMachinesUrl = baseUrl + machinesUrl;
    machinesFetch({ url: allMachinesUrl });
  };

  const handleLiveData = () => {
    setLiveOn(!liveOn);
  };

  const DataSorting = () => {
    switch (sortedBy) {
      case 'floor':
      case 'latitude':
      case 'longitude':
        if (orderBy) {
          data.sort((a, b) => {
            return a[sortedBy] - b[sortedBy];
          });
        } else {
          data.sort((a, b) => {
            return b[sortedBy] - a[sortedBy];
          });
        }
        break;
      default:
        if (data) {
          if (orderBy) {
            data.sort((a, b) => {
              return a[sortedBy].localeCompare(b[sortedBy]);
            });
          } else {
            data.sort((a, b) => {
              return b[sortedBy].localeCompare(a[sortedBy]);
            });
          }
        }
        break;
    }
    setData(data);
  };

  useEffect(() => {
    const machineId = upDataEventList.machine_id;
    LiveDataUpdate(upDataEventList);
    EffectedLine(machineId);
  }, [upDataEventList]);

  useEffect(() => {
    LiveData(liveOn);
  }, [liveOn]);

  useEffect(() => {
    handleReload();
  }, []);

  useEffect(() => {
    machineLineFetch({ url: linkUrl });
  }, [linkUrl]);

  useEffect(() => {
    DataSorting(data);
  }, [orderBy, sortedBy]);

  if (loading) return <div className='loading'>Data fetch in progress...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <button onClick={handleReload}>Reload</button>
      <button onClick={handleLiveData} disabled={liveOn}>
        {liveOn ? 'Living process' : 'Start Live Data fetch'}
      </button>
      <div className='table-content'>
        {loaded && <DataTableContainer data={data} />}
      </div>
    </>
  );
};

export default DataTable;
