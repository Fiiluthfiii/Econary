// Date formatting utility based on user preferences

import { format as dateFnsFormat } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date based on user's preferred format
 * @param {Date|string} date - Date to format
 * @param {string} formatPattern - Optional custom format pattern (overrides user preference)
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatPattern = null) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Get user's preferred date format from localStorage
  const userFormat = typeof window !== 'undefined' 
    ? localStorage.getItem('dateFormat') 
    : null;
  
  // Use custom pattern if provided, otherwise use user preference or default
  const pattern = formatPattern || userFormat || 'DD/MM/YYYY';
  
  // Convert format to date-fns format
  let dateFnsPattern;
  switch (pattern) {
    case 'DD/MM/YYYY':
      dateFnsPattern = 'dd/MM/yyyy';
      break;
    case 'MM/DD/YYYY':
      dateFnsPattern = 'MM/dd/yyyy';
      break;
    case 'YYYY-MM-DD':
      dateFnsPattern = 'yyyy-MM-dd';
      break;
    default:
      dateFnsPattern = 'dd/MM/yyyy';
  }
  
  return dateFnsFormat(dateObj, dateFnsPattern, { locale: id });
}

/**
 * Format datetime with time
 * @param {Date|string} date - Date to format
 * @param {boolean} includeSeconds - Include seconds in time
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date, includeSeconds = false) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(dateObj);
  
  const timePattern = includeSeconds ? 'HH:mm:ss' : 'HH:mm';
  const timeStr = dateFnsFormat(dateObj, timePattern);
  
  return `${dateStr}, ${timeStr}`;
}

/**
 * Format date in long format (e.g., "Jumat, 16 Oktober 2026")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateLong(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, 'EEEE, dd MMMM yyyy', { locale: id });
}

/**
 * Format date for input field (always YYYY-MM-DD for HTML date input)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, 'yyyy-MM-dd');
}

/**
 * Format datetime for input field (always YYYY-MM-DDTHH:mm for HTML datetime-local input)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted datetime string (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeForInput(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Get example date string based on format
 * @param {string} format - Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
 * @returns {string} Example date string
 */
export function getDateExample(format) {
  const exampleDate = new Date(2025, 4, 28); // May 28, 2025
  
  switch (format) {
    case 'DD/MM/YYYY':
      return dateFnsFormat(exampleDate, 'dd/MM/yyyy');
    case 'MM/DD/YYYY':
      return dateFnsFormat(exampleDate, 'MM/dd/yyyy');
    case 'YYYY-MM-DD':
      return dateFnsFormat(exampleDate, 'yyyy-MM-dd');
    default:
      return dateFnsFormat(exampleDate, 'dd/MM/yyyy');
  }
}

export default {
  formatDate,
  formatDateTime,
  formatDateLong,
  formatDateForInput,
  formatDateTimeForInput,
  getDateExample
};
