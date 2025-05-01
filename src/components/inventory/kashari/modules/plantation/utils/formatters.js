
/**
 * Format a number as a currency string in UGX format
 * @param {number} value - The numeric value to format
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value) => {
  // Handle edge cases
  if (value === null || value === undefined) {
    return "UGX 0";
  }

  // Convert to number if it's a string
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  // Format the number with commas
  return `UGX ${numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format a date string to a localized date format
 * @param {string} dateStr - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    console.error("Error formatting date:", err);
    return dateStr;
  }
};
