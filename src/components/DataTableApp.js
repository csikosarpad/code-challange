import React, { useState, useEffect, useContext } from 'react';

import { Context } from '../contexts/Context.js';
import { baseUrl, machinesUrl } from '../utils/constans.js';
import { localeDate } from '../utils/utils.js';

// components
const DataTableApp = () => {
  const value = useContext(Context);
  const { state, dispatch } = value;

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [dataLine, setDataLine] = useState(null);
  const [rowLine, setRowLine] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [sortedBy, setSortedBy] = useState('last_maintenance');
  const [orderBy, setOrderBy] = useState(true);
  const [liveOn, setLiveOn] = useState(false);

  const machines = state.data;
  const tableColumns = state.tableColumns;

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

      //setData(result.data);
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

  if (loading) return <div className='loading'>Data fetch in progress...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <button onClick={handleReload}>Reload</button>
      <button onClick={handleLiveData}>
        {liveOn ? 'Living process' : 'Start Live Data fetch'}
      </button>

      <div className='table-content'>
        {loaded && <DataTableContainer data={machines} />}
      </div>
    </>
  );
};

export default DataTableApp;
