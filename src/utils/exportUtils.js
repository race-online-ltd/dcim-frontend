import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports data to a CSV/Excel file.
 * @param {Array} data - The array of objects to export.
 * @param {string} fileName - The desired file name.
 */
export const exportToCSV = (data, fileName) => {
  if (!data || data.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  try {
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
  } catch (e) {
    console.error("Error saving file:", e);
  }
};
