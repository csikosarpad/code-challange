const dateOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const dateLocation = 'en-EN';

export const localeDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(dateLocation, dateOptions);
};
