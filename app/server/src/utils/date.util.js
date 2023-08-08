export function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-indexed, so we add 1.
    const year = currentDate.getFullYear();
    const ms = currentDate.getMilliseconds()
  
    return `${day}-${month}-${year}`;
  }