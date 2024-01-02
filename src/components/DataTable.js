import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { localeDate } from '../utils/constans.js';

const baseUrl =
  'https://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/';
const machinesUrl = '/api/v1/machines';

/*const FetchLink = (entry) => {

  const HandleFetchMachine = (ev) => {
    const link = ev.target;
    const rowLine = ev.target.parentNode.parentNode;

    const entry = link.textContent;
    const linkUrl = `${baseUrl}api/v1/machines/${entry}`;

    useEffect(() => {
      fetch(linkUrl)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          setData2(responseData.data);
        setLoaded2(true);
        setLoading2(false);
        })
        .catch((error) => {
          setError2(error);
        setLoading2(false);
        });
    }, []);
  };

  return (
    <span data={entry} onClick={HandleFetchMachine}>
      {entry}
    </span>
  );
};*/

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

const DataTableTitle = ({ children, ...tableTitles }) => {
  const cells = Object.values(tableTitles);
  return (
    <div className='data-row title' {...cells}>
      {cells.map((item) => {
        return <div className='cell title'>{item}</div>;
      })}
    </div>
  );
};

const DataTableRows = ({ children, ...restProps }) => {
  const { data } = restProps;
  return Object.values(data).map((line) => <DataTableRow {...line} />);
};

const DataTableRow = ({ ...restProps }) => {
  return (
    <div className='data-row'>
      {Object.entries(restProps).map((cell) => {
        return <DataTableCell {...cell} />;
      })}
    </div>
  );
};

const DataTableCell = ({ ...restProps }) => {
  const key = restProps[0];
  const value = restProps[1];
  let cellEntry = '';
  const FetchLink = (entry) => {
    return (
      <span data={entry} onClick={() => {}}>
        {entry}
      </span>
    );
  };

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
    default:
      cellEntry = value;
      break;
  }
  return <div className='cell'>{cellEntry}</div>;
};

const DataTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const machinesFetch = async ({ url, target }) => {
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

  useEffect(() => {
    const allMachinesUrl = baseUrl + machinesUrl;
    machinesFetch({ url: allMachinesUrl });
  }, []);

  if (loading) return <div className='loading'>Data fetch in progress...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='table-content'>
      {loaded && <DataTableContainer data={data} />}
    </div>
  );
};

export default DataTable;
