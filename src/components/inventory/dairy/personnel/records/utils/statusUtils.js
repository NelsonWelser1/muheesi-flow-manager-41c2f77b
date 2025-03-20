
/**
 * Returns the appropriate Tailwind CSS classes for recruitment status badges
 * @param {string} status - The recruitment status
 * @returns {string} Tailwind CSS classes for the badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return "bg-green-100 text-green-800 border-green-300";
    case 'Scheduled':
      return "bg-blue-100 text-blue-800 border-blue-300";
    case 'In Progress':
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 'Pending':
      return "bg-orange-100 text-orange-800 border-orange-300";
    case 'Rejected':
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};
