
export const generateBatchId = (tankValue) => {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
  const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '');
  return `${formattedDate}-${tankValue}-${formattedTime}`;
};
