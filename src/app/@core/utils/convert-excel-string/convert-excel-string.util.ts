export const convertExcelString = (value: string | number | undefined) => {
  return (value || '').toString().replace('\n', ' ').trim().replace(/\s+/g, ' ');
};
