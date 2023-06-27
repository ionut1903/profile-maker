export function formatDateToMMYYYY(date) {
    let formattedDate;
    
    if (/\d{2}\/\d{4}/.test(date)) {
      const parts = date.split('/');
      const month = String(Number(parts[0])).padStart(2, '0');
      const year = parts[1];
      formattedDate = `${month}/${year}`;
    } else if (/\d{4}-\d{2}-\d{2}/.test(date)) {
      const parsedDate = new Date(date);
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const year = parsedDate.getFullYear();
      formattedDate = `${month}/${year}`;
    } else if (/\d{2}-\d{4}/.test(date)) {
      const parts = date.split('-');
      const month = String(Number(parts[0])).padStart(2, '0');
      const year = parts[1];
      formattedDate = `${month}/${year}`;
    } else if (/\d{4}-\d{2}/.test(date)) {
      const parts = date.split('-');
      const month = String(Number(parts[1])).padStart(2, '0');
      const year = parts[0];
      formattedDate = `${month}/${year}`;
    } else {
      // Invalid date format
      return 'Invalid format';
    }
    
    return formattedDate;
  }