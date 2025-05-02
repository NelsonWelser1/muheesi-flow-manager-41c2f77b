
import { format, formatDistance } from 'date-fns';

// Format a date as a simple string (e.g. "Jan 21, 2023")
export const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Invalid date:', dateStr, error);
    return 'Invalid date';
  }
};

// Format a time (e.g. "14:30" to "2:30 PM")
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    // Create a date object with the time string (using today's date)
    const date = new Date();
    const [hours, minutes] = timeStr.split(':');
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Invalid time:', timeStr, error);
    return timeStr; // Return original if there's an issue
  }
};

// Get relative time (e.g. "2 days ago", "in 3 hours")
export const getRelativeTime = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Invalid date for relative time:', dateStr, error);
    return 'Unknown';
  }
};
