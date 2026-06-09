export const getDateFromStamp = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(parseInt(timestamp));
  return date;
};
