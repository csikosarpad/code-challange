const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const dateLocation = 'en-EN';

export const localeDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(dateLocation, dateOptions);
};

export const tableColumns = [
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

export const _tableColumns = [
  {
    name: 'ID',
    selector: (row) => row.id,
  },
  {
    name: 'Floor',
    selector: (row) => row.floor,
    sortable: true,
  },
  {
    name: 'Install date',
    selector: (row) => localeDate(row.install_date),
    sortable: true,
  },
  {
    name: 'Last maintenance',
    selector: (row) => localeDate(row.last_maintenance),
    sortable: true,
  },
  {
    name: 'Machine type',
    selector: (row) => row.machine_type,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => row.status,
    sortable: true,
  },
];
