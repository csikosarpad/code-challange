export const socketUrl =
  'wss://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/socket/';

export const baseUrl =
  'https://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/';

export const machinesUrl = '/api/v1/machines';

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

export const greetings = ['Lan, Ngo', 'Nilesh, Wagholikar', 'Kiss, Laszlo'];
