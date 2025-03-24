
// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
};

// Get date from X time ago
export const getDateFromTimeAgo = (timeRange) => {
  const now = new Date();
  
  switch (timeRange) {
    case 'hour':
      return new Date(now.setHours(now.getHours() - 1));
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return null; // All time
  }
};
