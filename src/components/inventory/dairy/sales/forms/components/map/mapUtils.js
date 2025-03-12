
// Map API constants
const API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';

/**
 * Get address details from coordinates using Geocoding API
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    return null;
  }
};

/**
 * Get coordinates and address from a search query
 */
export const getCoordinatesFromAddress = async (searchQuery) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        address: result.formatted_address,
        position: result.geometry.location
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

/**
 * Get a Google Maps Embed URL
 */
export const getMapEmbedUrl = (query) => {
  return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(query)}`;
};
